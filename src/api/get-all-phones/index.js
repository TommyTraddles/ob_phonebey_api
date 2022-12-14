const { getFilteredPhones } = require('./queries')

module.exports = (db) => async (req, res, next) => {
  const filters = {
    price_GT: req.query.price_GT,
    price_LT: req.query.price_LT,
    brands: req.query.brand,
    colors: req.query.color,
    storages: req.query.storage,
    order_by: req.query.order_by,
  }

  const data = await getFilteredPhones(db, { filters })

  if (!data) {
    return next({
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
