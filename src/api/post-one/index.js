const { createPhones } = require('./queries')

module.exports = (db) => async (req, res, next) => {
  const { PHONE } = res.locals

  const phones = [PHONE]
  const brands = [PHONE.brand]
  const screens = [PHONE.ts_scr_size]
  const rams = PHONE.mm_ram
  const colors = PHONE.colors
  const storages = PHONE.mm_stg

  const data = await createPhones(db, {
    phones,
    rams,
    brands,
    colors,
    storages,
    screens,
  })

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
