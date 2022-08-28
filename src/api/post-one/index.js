const { addOnePhone } = require('./queries')

module.exports = (db) => async (req, res, next) => {
  // 🔴 ADD POST INPUT VALIDATOR

  const items = {}

  const data = await addOnePhone(db, { items })

  if (!data) {
    return next({
      success: false,
      error: new Error('Phone couldn\t be created'),
    })
  }

  return res.json({
    success: true,
    data,
  })
}
