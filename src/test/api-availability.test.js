const { app } = require('../index')
const api = require('supertest')(app)

/**
 *
 * 🔴 🔴 🔴
 *
 * BeforeAll -> load DB
 *
 * AfterAll -> close connection
 */

describe('GET /get-all', () => {
  const endpoint = '/get-all'

  test('Endpoint should be operative', async () => {
    const expected = {
      statusCode: 200,
      success: true,
    }
    const req = await api.get(endpoint)
    const response = JSON.parse(req.text)
    expect(req.status).toEqual(expected.statusCode)
    expect(response.success).toEqual(expected.success)
  })

  test('Endpoint should return all phones', async () => {
    const req = await api.get(endpoint)
    const response = JSON.parse(req.text)

    response.data.forEach((phone) => {
      expect(phone.id).toBeDefined()
      expect(phone.new).toBeDefined()
      expect(phone.name).toBeDefined()
      expect(phone.brand).toBeDefined()
      expect(phone.price).toBeDefined()
      expect(phone.color).toBeDefined()
      expect(phone.images).toBeDefined()
      expect(phone.bestseller).toBeDefined()
    })
  })

  // 🔴
  test('Query: one brand as a string', async () => {
    const query = `${endpoint}?brand=black`
    const req = await api.get(query)
  })

  // 🔴
  test('Query: two brand as an array', async () => {
    const query = `${endpoint}?brand=iPhone&brand=Xiaomi`
    const req = await api.get(query)
  })
})

describe('GET /filters', () => {
  const endpoint = '/get-filters'

  test('Endpoint should be operative', async () => {
    const expected = {
      statusCode: 200,
      success: true,
    }
    const query = await api.get(endpoint)
    const response = JSON.parse(query.text)
    expect(query.status).toEqual(expected.statusCode)
    expect(response.success).toEqual(expected.success)
  })
})
