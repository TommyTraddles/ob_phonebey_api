const inputValidator = require('../middlewares/input-validator')
const router = require('express').Router()
const upload = require('../config/multer')

module.exports = (db) => {
  // retrive ALL phones WITH FILTERS + SORT values
  router.get('/get-all', require('./get-all-phones')(db))

  // retrieve ALL available filters
  router.get('/get-filters', require('./get-filters')(db))

  // retrieve ONE phone by ID
  router.get('/get-one/:phoneId', require('./get-one-by-id')(db))

  // create ONE new phone
  router.post('/add', upload, inputValidator, require('./post-one')(db))

  // DELETE ONE phone
  router.delete('/delete/:phoneId', require('./delete-one')(db))

  return router
}
