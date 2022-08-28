require('dotenv').config()
const { JSONfactory, PhoneDataFormater } = require('./helper')
const { clickCmp } = require('puppeteer-cmp-clicker')
const puppeteer = require('puppeteer')

module.exports = async ({ destineDir, debug = false }) => {
  const { WS_BASE_URL, WS_URL } = process.env

  try {
    console.info('🚀 Starting webscrap')

    const browser = await puppeteer.launch({ headless: !debug })
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })

    await page.goto(WS_URL, { waitUntil: 'networkidle0' })

    await clickCmp({ page })
    await page.click('#onetrust-pc-btn-handler')

    if (!debug) {
      let loadSelector = await page.$('#PA-listado-terminales-mas-resultados')
      while (loadSelector !== null) {
        await page.evaluate((elm) => elm.click(), loadSelector)
        loadSelector = await page.$('#PA-listado-terminales-mas-resultados')
      }
    }

    const links = await page.evaluate(
      (WS_BASE_URL) =>
        Array.from(document.querySelectorAll('.deviceItem a')).map((elm) => {
          return `${WS_BASE_URL}${elm.getAttribute('href')}`
        }),
      WS_BASE_URL
    )

    const output = []
    const rams = { rams: [] }
    const colors = { colors: [] }
    const brands = { brands: [] }
    const screens = { screens: [] }
    const storages = { storages: [] }

    // for each link
    for (let link of links) {
      await page.goto(link)

      const data = await page.evaluate((WS_BASE_URL) => {
        const data = {}

        const phone = document.querySelector(
          '[class="heading heading-gp--title02 heading-gp--font-light heading--left heading-gp--green-dark heading-gp--transparent-background pageTitle particulares  heading--block heading-decoration--none heading-border--none"]'
        ).innerHTML

        data.brand = phone.split(' ')[0]
        data.name = phone.split(' ').slice(1).join(' ')

        data.price = Number(
          document
            .querySelector(
              '[class=" terminalPrice_general-wrapper terminalPrice_price-to-pay-large"]'
            )
            .innerHTML.replace(/€/g, '')
        )

        data.colors = Array.from(
          document.querySelectorAll('.colorSelector_circle-border_regular')
        ).map((elm) => {
          let color = elm.getAttribute('title').toLowerCase().split(' ')[0]
          if (color == '(product)') color = 'rojo'
          return color
        })

        data.images = Array.from(
          document.querySelectorAll('.terminalFileImages_main')
        ).map((elm) => {
          return `${WS_BASE_URL}${elm.getAttribute('src')}`
        })

        Array.from(
          document.querySelectorAll(
            '.terminalFileTechnicalInformationElement_wrapper'
          )
        ).map((elm) => {
          let category = elm
            .querySelector('.terminalFileTechnicalInformationElement_title')
            .innerHTML.toLowerCase()
            .replace(/ /g, '_')

          const sanitizedCategory = {
            otras_características: 'otros',
            sistema_operativo_y_procesador: 'os',
            características_físicas: 'fisico',
            cámara: 'camara',
            batería: 'bateria',
          }

          category = sanitizedCategory[category] || category

          let items = {}

          Array.from(
            elm.querySelectorAll(
              '.terminalFileTechnicalInformationElement_element'
            )
          ).map((item) => {
            item = item.innerHTML
            const arr = item.split(':')
            const key = arr[0].toLowerCase().replace(/ /g, '_')
            let value = arr[1]?.trim()

            if (category == 'conexiones' || category == 'otros') {
              if (!items.other) {
                items.other = []
              }
              return items.other.push(item)
            }

            if (!value) {
              if (!items.other) {
                items.other = []
              }
              return items.other.push(key)
            }

            if (
              key == 'resolución_de_pantalla' ||
              key == 'resolución_pantalla_(píxeles)' ||
              key == 'resolución_pantalla_(pixels)'
            ) {
              return (items.resolucion_pantalla = value)
            }

            if (
              key == 'tecnología_de_pantalla' ||
              key == 'tecnologia' ||
              key == 'tecnología'
            ) {
              return (items.tecnologia_pantalla = value)
            }

            if (
              key == 'tamaño_de_la_pantalla' ||
              key == 'tamaño_de_pantalla' ||
              key == 'tamaño_en_pulgadas' ||
              key == 'tamaño'
            ) {
              value = arr[1]
                .split('(')[0]
                .trim()
                .replace(/’|,/g, '.')
                .replace(/'|”|"/g, '')
              value = value.endsWith('.') ? value.slice(0, -1) : value
              return (items.size = Number(value))
            }

            if (key == 'cámara_principal') {
              return (items.camara_principal = value)
            }

            if (key == 'cámara_frontal') {
              return (items.camara_frontal = value)
            }

            const storage = []
            if (key == 'memoria_interna' || key == 'memoria') {
              value.split('/').forEach((entry) => {
                let gb = Number(entry.replace(/\D/g, ''))
                if (gb == 1) gb = 1024
                storage.push(gb)
              })
              return (items.memoria_interna = storage)
            }

            if (key == 'memoria_ram') {
              value.split('/').forEach((entry) => {
                let gb = Number(entry.replace(/\D/g, ''))
                storage.push(gb)
              })
              return (items[key] = storage)
            }

            if (
              key == 'cargador' ||
              key == 'cargador_universal' ||
              key == 'cargador_universal_tipo' ||
              key == 'cargador_universal_micro_usb'
            ) {
              return (items.cargador = value)
            }
            if (key == 'tipo_de_batería' || key == 'tipo_batería') {
              return (items.tipo_bateria = value)
            }

            return (items[key] = value)
          })
          return (data[category] = items)
        })
        return data
      }, WS_BASE_URL)

      // Retrieve unique values
      if (!brands.brands.includes(data.brand)) {
        brands.brands.push(data.brand)
      }
      const screen = data.pantalla.size
      if (!screens.screens.includes(screen)) {
        screens.screens.push(screen)
      }
      data.colors?.forEach((elm) => {
        if (!colors.colors.includes(elm)) {
          colors.colors.push(elm)
        }
      })
      data.memoria?.memoria_interna?.forEach((elm) => {
        if (!storages.storages.includes(elm)) {
          storages.storages.push(elm)
        }
      })
      data.memoria?.memoria_ram?.forEach((elm) => {
        if (!rams.rams.includes(elm)) {
          rams.rams.push(elm)
        }
      })
      output.push(data)
      console.info('✔', { phone: `${data.brand} - ${data.name}` })
    }

    // Store values on files
    const phones = PhoneDataFormater(output)
    await [brands, colors, screens, storages, rams, phones].forEach(
      async (item) => await JSONfactory({ destineDir, item })
    )

    if (debug) {
      const fs = require('fs')
      await fs.promises.writeFile(
        `${destineDir}/OUTPUT.json`,
        JSON.stringify(output),
        'utf8'
      )
    }

    await browser.close()
    console.info({ total: output.length })
    console.info('✅ Webscraping done')
  } catch (error) {
    console.info('> ❌ [Error] during webscraping')
    console.info('>', error)
  }
}
