const { getOnePhone } = require('./queries')

module.exports = (db) => async (req, res, next) => {
  let { phoneId } = req.params

  const data = await getOnePhone(db, { phoneId })

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
