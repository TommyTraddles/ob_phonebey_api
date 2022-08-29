module.exports = (req, res, next) => {
  const {
    brand,
    name,
    price,
    colors,
    bestseller,
    new: newPhone,
    ts_os,
    ts_os_version,
    ts_os_procesor,
    ts_os_speed,
    ts_phy_dimen,
    ts_phy_weight,
    ts_phy_sim,
    ts_phy_cable,
    ts_scr_size,
    ts_scr_tech,
    ts_scr_px,
    ts_scr_secu,
    ts_cam_main,
    ts_cam_front,
    mm_ram,
    mm_stg,
    ts_bat_type,
    ts_bat_char_t,
    ts_bat_char,
    ts_net_other,
    ts_other,
  } = req.body

  // ⛔️ Only validating NOT NULL fields
  // field type - content validation comes from DB due linited time

  if (!brand) return handleInvalidInput(`Brand name should be defined`)

  if (!name) return handleInvalidInput(`Phone name should be defined`)

  if (!price) return handleInvalidInput(`Phone price should be defined`)

  if (!colors)
    return handleInvalidInput(`Phone colors should contain at least one color`)

  if (!req.files[0])
    return handleInvalidInput(`Phone should have at least one image`)

  if (!ts_scr_size)
    return handleInvalidInput(`Phone screen size should be defined`)

  const screens = Number(ts_scr_size)

  if (!mm_ram)
    return handleInvalidInput(`Phone should have at least one ram value `)

  const rams = []
  if (Array.isArray(mm_ram)) {
    mm_ram.forEach((elm) => rams.push(Number(elm)))
  } else {
    rams.push(Number(mm_ram))
  }

  if (!mm_stg)
    return handleInvalidInput(`Phone should have at least one storage value `)

  const storages = []
  if (Array.isArray(mm_stg)) {
    mm_stg.forEach((elm) => storages.push(Number(elm)))
  } else {
    storages.push(Number(mm_stg))
  }

  function handleInvalidInput(message, statusCode = 400) {
    return next({
      success: false,
      statusCode,
      error: new Error(message),
    })
  }

  // return only needed fields
  res.locals.PHONE = {
    brand,
    name,
    price,
    colors,
    images: [],
    bestseller,
    new: newPhone,
    ts_os,
    ts_os_version,
    ts_os_procesor,
    ts_os_speed,
    ts_phy_dimen,
    ts_phy_weight,
    ts_phy_sim,
    ts_phy_cable,
    ts_scr_size: screens,
    ts_scr_tech,
    ts_scr_px,
    ts_scr_secu,
    ts_cam_main,
    ts_cam_front,
    mm_ram: rams,
    mm_stg: storages,
    ts_bat_type,
    ts_bat_char_t,
    ts_bat_char,
    ts_net_other,
    ts_other,
  }

  next()
}
