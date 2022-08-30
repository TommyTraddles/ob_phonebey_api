const { app } = require('../index')
const api = require('supertest')(app)
const path = require('path')

let IDs = {}

beforeAll(async () => {
  IDs = await require('../../script/3-seed-tables')({
    sourceDir: path.join(__dirname, 'json'),
  })
})

afterAll(async () => {
  await require('../../script/4-delete-tables')

  await require('../../script/3-seed-tables')({
    sourceDir: path.join(__dirname, 'json'),
  })
})

//  GET-FILTERS
describe('GET /get-filters', () => {
  const endpoint = '/get-filters'

  test('Should be operative', async () => {
    const req = await api.get(endpoint)
    const response = JSON.parse(req.text)
    expect(req.status).toEqual(200)
    expect(response.success).toBeTruthy()
  })

  test('Should return all available colors', async () => {
    const colors = [
      'azul',
      'blanco',
      'dorado',
      'grafito',
      'gris',
      'lavanda',
      'morado',
      'negro',
      'oro',
      'plata',
      'verde',
    ]
    const req = await api.get(endpoint)
    const response = JSON.parse(req.text)
    expect(response.data.colors).toEqual(colors)
  })

  test('Should return all available brands', async () => {
    const brands = ['Motorola', 'OPPO', 'Samsung', 'Xiaomi', 'iPhone']
    const req = await api.get(endpoint)
    const response = JSON.parse(req.text)
    expect(response.data.brands).toEqual(brands)
  })

  test('Should return all available prices', async () => {
    const prices = [199, 1799]
    const req = await api.get(endpoint)
    const response = JSON.parse(req.text)
    expect(response.data.prices).toEqual(prices)
  })

  test('Should return all available storages', async () => {
    const storages = [64, 128, 256, 512, 1024]
    const req = await api.get(endpoint)
    const response = JSON.parse(req.text)
    expect(response.data.storages).toEqual(storages)
  })
})

describe('GET /get-all', () => {
  const endpoint = '/get-all'

  test('Should be operative', async () => {
    const req = await api.get(endpoint)
    const response = JSON.parse(req.text)
    expect(req.status).toEqual(200)
    expect(response.success).toBeTruthy()
  })

  test('Should return the necesary info to render on catalog', async () => {
    const expected = {
      results: 9,
    }
    const query = `${endpoint}`
    const req = await api.get(query)
    const response = JSON.parse(req.text)

    expect(response.results).toEqual(expected.results)
    response.data.forEach((phone) => {
      expect(phone.id).not.toBeNull()
      expect(phone.brand).not.toBeNull()
      expect(phone.name).not.toBeNull()
      expect(phone.price).not.toBeNull()
      expect(phone.bestseller).not.toBeNull()
      expect(phone.new).not.toBeNull()
      expect(phone.color).not.toBeNull()
      expect(phone.images).not.toBeNull()
    })
  })

  describe('Should return all phones', () => {
    test('with no filter nor order', async () => {
      const expected = {
        results: 9,
      }
      const query = `${endpoint}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)
      expect(response.results).toEqual(expected.results)
    })

    // FILTER

    test('filter by brand', async () => {
      const expected = {
        brands: ['iPhone'],
        results: 2,
      }
      const query = `${endpoint}?brand=${expected.brands[0]}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
      response.data.forEach((phone) =>
        expect(
          expected.brands.some((brand) => phone.brand == brand)
        ).toBeTruthy()
      )
    })

    test('filter by an array of brands', async () => {
      const expected = {
        brands: ['iPhone', 'Xiaomi'],
        results: 4,
      }
      const query = `${endpoint}?brand=${expected.brands[0]}&brand=${expected.brands[1]}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
      response.data.forEach((phone) => {
        const validation = expected.brands.some((brand) => phone.brand == brand)
        expect(validation).toBeTruthy()
      })
    })

    test('filter by color', async () => {
      const expected = {
        colors: ['negro'],
        results: 5,
      }
      const query = `${endpoint}?color=${expected.colors[0]}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)

      response.data.forEach((phone) => {
        const validation = expected.colors.some((expectedColor) =>
          phone.color.includes(expectedColor)
        )
        expect(validation).toBeTruthy()
      })
    })

    test('filter by an array of colors', async () => {
      const expected = {
        colors: ['negro', 'azul'],
        results: 8,
      }
      const query = `${endpoint}?color=${expected.colors[0]}&color=${expected.colors[1]}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      response.data.forEach((phone) => {
        const validation = expected.colors.some((expectedColor) =>
          phone.color.includes(expectedColor)
        )
        expect(validation).toBeTruthy()
      })
    })

    test('filter by storage', async () => {
      const expected = {
        storages: [64],
        results: 1,
      }
      const query = `${endpoint}?storage=${expected.storages[0]}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
    })

    test('filter by an array of storages', async () => {
      const expected = {
        storages: [64, 128],
        results: 8,
      }
      const query = `${endpoint}?storage=${expected.storages[0]}&storage=${expected.storages[1]}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
    })

    test('filter by prices greater than 1000 €', async () => {
      const expected = {
        price_GT: 1000,
        results: 3,
      }

      const query = `${endpoint}?price_GT=${expected.price_GT}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
      response.data.forEach((phone) =>
        expect(phone.price).toBeGreaterThanOrEqual(expected.price_GT)
      )
    })

    test('filter by prices less than 200 €', async () => {
      const expected = {
        price_LT: 200,
        results: 1,
      }

      const query = `${endpoint}?price_LT=${expected.price_LT}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
      response.data.forEach((phone) =>
        expect(phone.price).toBeLessThanOrEqual(expected.price_LT)
      )
    })

    test('filter by prices between 300 € and 1000 €', async () => {
      const expected = {
        price_GT: 300,
        price_LT: 1000,
        results: 4,
      }

      const query = `${endpoint}?price_LT=${expected.price_LT}&price_GT=${expected.price_GT}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
      response.data.forEach((phone) => {
        expect(phone.price).toBeGreaterThanOrEqual(expected.price_GT)
        expect(phone.price).toBeLessThanOrEqual(expected.price_LT)
      })
    })

    // ORDERED BY

    test('order by price DESC', async () => {
      const expected = {
        order_by: 'price DESC',
        prices: [1799, 1379, 1099, 829, 399, 399, 349, 219, 199],
        results: 9,
      }

      const query = `${endpoint}?order_by=${expected.order_by}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
      response.data.forEach((phone, idx) => {
        expect(phone.price).toEqual(expected.prices[idx])
      })
    })

    test('order by price ASC', async () => {
      const expected = {
        order_by: 'price ASC',
        prices: [199, 219, 349, 399, 399, 829, 1099, 1379, 1799],
        results: 9,
      }

      const query = `${endpoint}?order_by=${expected.order_by}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
      response.data.forEach((phone, idx) => {
        expect(phone.price).toEqual(expected.prices[idx])
      })
    })

    test('order by name ASC', async () => {
      const expected = {
        order_by: 'name ASC',
        names: [
          '13 Pro Max',
          'Galaxy S21 FE',
          'Galaxy Z Flip4 5G',
          'Galaxy Z Fold4 5G',
          'Moto G71 5G',
          'Redmi 10C',
          'Redmi Note 11 Pro 5G',
          'Reno8 Lite 5G',
          'SE (2020)',
        ],
        results: 9,
      }

      const query = `${endpoint}?order_by=${expected.order_by}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
      response.data.forEach((phone, idx) => {
        expect(phone.name).toEqual(expected.names[idx])
      })
    })

    test('order by name DESC', async () => {
      const expected = {
        order_by: 'name DESC',
        names: [
          'SE (2020)',
          'Reno8 Lite 5G',
          'Redmi Note 11 Pro 5G',
          'Redmi 10C',
          'Moto G71 5G',
          'Galaxy Z Fold4 5G',
          'Galaxy Z Flip4 5G',
          'Galaxy S21 FE',
          '13 Pro Max',
        ],
        results: 9,
      }

      const query = `${endpoint}?order_by=${expected.order_by}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
      response.data.forEach((phone, idx) => {
        expect(phone.name).toEqual(expected.names[idx])
      })
    })

    // COMPOSE: FILTER + ORDERED BY

    test('filter by brand and order by name ASC', async () => {
      const expected = {
        order_by: 'name ASC',
        brands: ['iPhone', 'Xiaomi'],
        names: ['13 Pro Max', 'Redmi 10C', 'Redmi Note 11 Pro 5G', 'SE (2020)'],
        results: 4,
      }

      const query = `${endpoint}?order_by=${expected.order_by}&brand=${expected.brands[0]}&brand=${expected.brands[1]}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
      response.data.forEach((phone, idx) => {
        expect(phone.name).toEqual(expected.names[idx])

        const validation = expected.brands.some((brand) => phone.brand == brand)
        expect(validation).toBeTruthy()
      })
    })

    test('filter by brand and storage, and order by price DESC', async () => {
      const expected = {
        order_by: 'price DESC',
        brands: ['iPhone', 'Xiaomi'],
        storages: [256],
        prices: [1379, 399],
        results: 2,
      }

      const query = `${endpoint}?order_by=${expected.order_by}&brand=${expected.brands[0]}&brand=${expected.brands[1]}&storage=${expected.storages[0]}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
      response.data.forEach((phone, idx) => {
        expect(phone.price).toEqual(expected.prices[idx])
        const validation = expected.brands.some((brand) => phone.brand == brand)
        expect(validation).toBeTruthy()
      })
    })

    test('filter by brand, color and storage, and order by price ASC', async () => {
      const expected = {
        order_by: 'price ASC',
        brands: ['iPhone', 'Xiaomi'],
        storages: [256],
        colors: ['blanco'],
        prices: [399],
        results: 1,
      }

      const query = `${endpoint}?order_by=${expected.order_by}&brand=${expected.brands[0]}&brand=${expected.brands[1]}&storage=${expected.storages[0]}&color=${expected.colors[0]}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.results).toEqual(expected.results)
      response.data.forEach((phone, idx) => {
        expect(phone.price).toEqual(expected.prices[idx])
        const validation = expected.brands.some((brand) => phone.brand == brand)
        expect(validation).toBeTruthy()
      })
    })
  })
})

describe('GET /one/:id', () => {
  const endpoint = '/get-one'

  test('Should return error when passed an invalid phone id', async () => {
    const query = `${endpoint}/1`
    const req = await api.get(query)
    const response = JSON.parse(req.text)

    expect(response.success).not.toBeTruthy()
  })

  test('Should return the complete info of each phone', async () => {
    Object.values(IDs.ids.phonesIds).forEach(async (phoneId) => {
      const query = `${endpoint}/${phoneId}`
      const req = await api.get(query)
      const response = JSON.parse(req.text)

      expect(response.data.id).not.toBeNull()
      expect(response.data.brand).not.toBeNull()
      expect(response.data.name).not.toBeNull()
      expect(response.data.price).not.toBeNull()
      expect(response.data.bestseller).not.toBeNull()
      expect(response.data.new).not.toBeNull()
      expect(response.data.color).not.toBeNull()
      expect(response.data.images).not.toBeNull()
      expect(response.data[0]).toHaveProperty('storage')
      expect(response.data[0]).toHaveProperty('ram')
      expect(response.data[0]).toHaveProperty('ts_os')
      expect(response.data[0]).toHaveProperty('ts_os_version')
      expect(response.data[0]).toHaveProperty('ts_os_procesor')
      expect(response.data[0]).toHaveProperty('ts_os_speed')
      expect(response.data[0]).toHaveProperty('ts_phy_dimen')
      expect(response.data[0]).toHaveProperty('ts_phy_weight')
      expect(response.data[0]).toHaveProperty('ts_phy_weight')
      expect(response.data[0]).toHaveProperty('ts_phy_sim')
      expect(response.data[0]).toHaveProperty('ts_phy_cable')
      expect(response.data[0]).toHaveProperty('ts_scr_size')
      expect(response.data[0]).toHaveProperty('ts_scr_tech')
      expect(response.data[0]).toHaveProperty('ts_scr_px')
      expect(response.data[0]).toHaveProperty('ts_scr_secu')
      expect(response.data[0]).toHaveProperty('ts_cam_main')
      expect(response.data[0]).toHaveProperty('ts_cam_front')
      expect(response.data[0]).toHaveProperty('ts_bat_type')
      expect(response.data[0]).toHaveProperty('ts_bat_char_t')
      expect(response.data[0]).toHaveProperty('ts_bat_char')
      expect(response.data[0]).toHaveProperty('ts_net_other')
      expect(response.data[0]).toHaveProperty('ts_other')
    })
  })
})

describe('DELETE /delete/:id', () => {
  const endpoint = '/delete'

  test('Should return error when passed an invalid phone id', async () => {
    const query = `${endpoint}/1`
    const req = await api.delete(query)
    const response = JSON.parse(req.text)

    expect(req.status).toEqual(400)
    expect(response.success).not.toBeTruthy()
  })

  test('Should delete a phone by id', async () => {
    const id = Object.values(IDs.ids.phonesIds)[0]
    const query = `${endpoint}/${id}`
    const req = await api.delete(query)
    const response = JSON.parse(req.text)

    expect(req.status).toEqual(200)
    expect(response.success).toBeTruthy()
  })
})

describe('POST /add', () => {
  const endpoint = '/add'

  describe('Should return error', () => {
    test('when passed no brand', async () => {
      const body = {}
      const req = await api.post(endpoint).send(body)
      const response = JSON.parse(req.text)

      expect(req.status).toEqual(400)
      expect(response.success).not.toBeTruthy()
    })

    test('when passed no name', async () => {
      const body = { brand: 'brand' }
      const req = await api.post(endpoint).send(body)
      const response = JSON.parse(req.text)

      expect(req.status).toEqual(400)
      expect(response.success).not.toBeTruthy()
    })

    test('when passed no price', async () => {
      const body = { brand: 'brand', name: 'name' }
      const req = await api.post(endpoint).send(body)
      const response = JSON.parse(req.text)

      expect(req.status).toEqual(400)
      expect(response.success).not.toBeTruthy()
    })

    test('when passed no color', async () => {
      const body = { brand: 'brand', name: 'name', price: 99 }
      const req = await api.post(endpoint).send(body)
      const response = JSON.parse(req.text)

      expect(req.status).toEqual(400)
      expect(response.success).not.toBeTruthy()
    })

    // 🟨 IMAGE

    // test('when passed no image', async () => {
    //   const body = {
    //     brand: 'brand',
    //     name: 'name',
    //     price: 99,
    //     colors: 'azul',
    //   }
    //   const req = await api.post(endpoint).send(body)
    //   const response = JSON.parse(req.text)

    //   expect(req.status).toEqual(400)
    //   expect(response.success).not.toBeTruthy()

    //   expect(response).toEqual('error')
    // })

    // 🟨 SCREEN_SIZE

    // 🟨 MM_RAM

    // 🟨 MM_STG

    // 🟨 OK
  })
})
