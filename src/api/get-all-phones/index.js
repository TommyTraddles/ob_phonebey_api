const { getAllPhones } = require('./queries')

module.exports = (db) => async (req, res, next) => {
  const data = await getAllPhones(db)

  if (!data) {
    next({
      success: false,
      error: new Error('Phones couldn\t be retrieved'),
    })
  }

  return res.json({
    success: true,
    data,
  })
}
