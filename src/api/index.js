const inputValidator = require('../middlewares/input-validator')
const router = require('express').Router()
const upload = require('../config/multer')

module.exports = (db) => {
  router.get('/', require('./main')(db))

  // retrive ALL phones WITH FILTERS + SORT values
  router.get('/get-all', require('./get-all-phones')(db))

  // retrieve ALL available filters
  router.get('/get-filters', require('./get-filters')(db))

  // retrieve ONE phone by ID
  router.get('/get-one/:id', require('./get-one-by-id')(db))

  // create ONE new phone
  router.get('/add', upload, inputValidator, require('./post-one')(db))

  // DELETE / one

  return router
}


/**
 * 
 * ❌ TO-DO
 * 
 * CLOUDINARY URL
 * 
 * SANITIZE POST INPUT
 * 
 * REFACTOR SEED-INSERT
 * 
 * CREATE TESTS
 * 
 * DELETE ONE PHONE
 * 
 * EXPORT POSTMAN
 * 
 * WRITE README
 * 
 * PUSH REPO
 * 
 */