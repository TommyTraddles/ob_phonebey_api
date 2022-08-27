const router = require('express').Router()

module.exports = db => {

  router.get('/', (req, res, next) => {
    return res.json({
      success: true, 
      data: 'Hello world'
    })
  })

  return router
}