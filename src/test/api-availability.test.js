const { app } = require('../index')
const api = require('supertest')(app)

describe('GET / [Endpoint availability]', () => {
  test('API should be operative', async () => {
    const expected = {
      statusCode: 200,
      success: true,
    }
    const response = await api.get('/')
    expect(response.status).toEqual(expected.statusCode)
    expect(JSON.parse(response.text).success).toEqual(expected.success)
  })
})
