const { app } = require('../index')
const api = require('supertest')(app)

describe('GET /', () => {
  test('API should be operative', async () => {
    const expected = {
      statusCode: 200,
      success: true,
    }
    const query = await api.get('/')
    const response = JSON.parse(query.text)
    expect(query.status).toEqual(expected.statusCode)
    expect(response.success).toEqual(expected.success)
  })
})

describe('GET /get-all', () => {
  const endpoint = '/get-all'

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

  test('Endpoint should return all phones', async () => {
    const query = await api.get(endpoint)
    const response = JSON.parse(query.text)

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