const router = require('express').Router()

module.exports = (db) => {
  router.get('/', require('./main')(db))

  // GET / all products WITH FILTERS + SORT
  router.get('/get-all', require('./get-all-phones')(db))

  // GET available filters
  router.get('/get-filters', require('./get-filters')(db))

  // GET / GET ONE PRODUCT
  router.get('/get-one/:id', require('./get-one-by-id')(db))

  // POST /one
  router.get('/add', require('./post-one')(db))

  // GET / YOU MAY ALSO LIKE (7 random)
  // DELETE / one

  return router
}
