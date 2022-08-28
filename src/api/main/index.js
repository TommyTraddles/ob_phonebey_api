module.exports = (db) => async (req, res, next) => {
  return res.json({
    success: true,
    data: 'Hello world',
  })
}
