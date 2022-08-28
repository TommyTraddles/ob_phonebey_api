const router = require('express').Router()

module.exports = (db) => {
  router.get('/', require('./main')(db))

  // GET / all products w/ NO FILTERS
  router.get('/get-all', require('./get-all-phones')(db))

  // GET / all products WITH FILTER

  // GET / all products WITH FILTERS + SORT

  // GET / GET ONE PRODUCT

  // GET / YOU MAY ALSO LIKE (7 random)

  return router
}
