const { deleteOne } = require('./queries')

module.exports = (db) => async (req, res, next) => {
  const { phoneId } = req.params

  const data = await deleteOne(db, { phoneId })

  if (!data) {
    return next({
      success: false,
      error: new Error("Phone couln't be deleted"),
    })
  }

  return res.json({
    success: true,
    data,
  })
}
