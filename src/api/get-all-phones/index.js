const { getAllPhones, getFilteredPhones } = require('./queries')

module.exports = (db) => async (req, res, next) => {
  // GET / all products WITH FILTER

  const filters = {
    price_GT: req.query.price_GT,
    price_LT: req.query.price_LT,
    brands: req.query.brand,
    colors: req.query.color,
    storages: req.query.storage,
  }

  const data = await getFilteredPhones(db, { filters })

  if (!data) {
    next({
      success: false,
      error: new Error('Phones couldn\t be retrieved'),
    })
  }

  return res.json({
    success: true,
    results: data.length,
    data,
  })
}
