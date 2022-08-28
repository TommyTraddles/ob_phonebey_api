const router = require('express').Router()

module.exports = (db) => {
  router.get('/', require('./main')(db))

  // GET / all products WITH FILTERS + SORT
  router.get('/get-all', require('./get-all-phones')(db))

  // GET available filters
  router.get('/get-filters', require('./get-filters')(db))

  // GET / GET ONE PRODUCT

  // GET / YOU MAY ALSO LIKE (7 random)

  // POST /one

  // DELETE / one

  return router
}
