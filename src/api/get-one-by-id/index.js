const { getOnePhone } = require('./queries')

module.exports = (db) => async (req, res, next) => {
  let { id } = req.params

  const data = await getOnePhone(db, { id })

  if (!data) {
    return next({
      success: false,
      error: new Error('Phone couldn\t be retrieved'),
    })
  }

  return res.json({
    success: true,
    data,
  })
}
