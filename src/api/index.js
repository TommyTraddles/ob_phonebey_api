const router = require('express').Router()

module.exports = (db) => {
  router.get('/', require('./main')(db))

  // GET all products w/ NO FILTERS
  router.get('/get-all', require('./get-all-phones')(db))

  // GET available filters
  router.get('/get-filters', require('./get-filters')(db))

  // GET / all products WITH FILTERS + SORT

  // GET / GET ONE PRODUCT

  // GET / YOU MAY ALSO LIKE (7 random)

  return router
}
