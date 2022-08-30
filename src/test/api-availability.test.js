const { app } = require('../index')
const api = require('supertest')(app)
const path = require('path')

beforeAll(async () => {
  await require('../../script/3-seed-tables')({
    sourceDir: path.join(__dirname, 'json'),
  })
})

// afterAll(async () => {
//   await require('../../script/4-delete-tables')
// })

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
    const prices = ['$199.00', '$1,799.00']
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





//  GET-ALL

/**
 *
 * ✅
 * none
 * Brand
 * Brand []
 * Price GT
 * Price LT
 * Price GT  - LT
 * storage
 * storage []
 * color
 * color []
 * order name
 * order name DESC
 * order price
 * order price DESC
 * filter 1 + order
 * filter 2 + order
 * filter 3 + order
 *
 */

//  GET-ONE
/**
 *
 * ✅
 * id OK
 * ❌
 * id BAD
 *
 */

//  ADD
/**
 * ❌
 * brand
 * name
 * colors
 * images
 * no jpg | png | jpeg
 * + 1mb
 *
 * screen_size
 * mm_ram
 * mm_stg
 *
 * ✅
 * ok
 *
 */

//  DELETE
/**
 *
 * ✅
 * id OK
 * ❌
 * id BAD
 *
 */
