const path = require('path')
const fs = require('fs')

function retrieveName(item) {
  return Object.keys(item)[0]
}

async function validateDirectory(destineDir) {
  if (!fs.existsSync(destineDir)) return fs.mkdirSync(destineDir)
}

async function JSONfactory({ destineDir, item }) {
  await validateDirectory(destineDir)

  const fileName = retrieveName(item)

  return await fs.promises.writeFile(
    `${destineDir}/${fileName}.json`,
    JSON.stringify(item),
    'utf8'
  )
}

function PhoneDataFormater(DATA) {
  let arr = { phones: [] }

  DATA.forEach((elm) => {
    let phone = {}
    phone.brand = elm.brand // brand_id
    phone.name = elm.name
    phone.price = elm.price
    phone.colors = elm.colors // [] colors table
    phone.images = elm.images // [] images table
    phone.bestseller = ~~(Math.random() * 100) > 80 ? true : false
    phone.new = ~~(Math.random() * 100) > 80 ? true : false
    phone.ts_os = elm.os?.sistema_operativo || null
    phone.ts_os_version = elm.os?.versión || null
    phone.ts_os_procesor = elm.os?.procesador || null
    phone.ts_os_speed = elm.os?.velocidad_procesador || null
    phone.ts_phy_dimen = elm.fisico?.dimensiones || null
    phone.ts_phy_weight = elm.fisico?.peso || null
    phone.ts_phy_sim = elm.fisico?.tipo_de_sim || null
    phone.ts_phy_cable = elm.fisico?.cable_de_datos || null
    phone.ts_scr_size = elm.pantalla?.size || null // screen_id: 'UUID',
    phone.ts_scr_tech = elm.pantalla?.tecnologia_pantalla || null
    phone.ts_scr_px = elm.pantalla?.resolucion_pantalla || null
    phone.ts_scr_secu = elm.pantalla?.bloqueo_de_seguridad || null
    phone.ts_cam_main = elm.camara?.camara_principal || null
    phone.ts_cam_front = elm.camara?.camara_frontal || null
    phone.mm_ram = elm.memoria?.memoria_ram || null // [] ram table
    phone.mm_stg = elm.memoria?.memoria_interna || null // [] storage table
    phone.ts_bat_type = elm.bateria?.tipo_bateria || null
    phone.ts_bat_char_t = elm.bateria?.tipo_de_carga || null
    phone.ts_bat_char = elm.bateria?.cargador || null
    phone.ts_net_other = elm.conexiones?.other || null // []
    phone.ts_other = elm?.otros?.other || null // []
    arr.phones.push(phone)
  })
  return arr
}

module.exports = {
  PhoneDataFormater,
  JSONfactory,
}
