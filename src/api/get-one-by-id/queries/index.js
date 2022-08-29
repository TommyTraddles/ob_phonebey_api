const { sql } = require('slonik')

async function getOnePhone(db, { phoneId  }) {
  try {
    const onePhone = sql`
    SELECT 
      p.id, 
      b.brand, 
      p.name, 
      p.price, 
      p.bestseller, 
      p.new,
      ARRAY (
        SELECT c.color
        FROM colors AS c
        JOIN phones_colors AS pc
        ON pc.color_id = c.id
        WHERE pc.phone_id = p.id
      ) as colors,
      ARRAY(
        SELECT i.url 
        FROM images AS i
        WHERE i.phone_id = p.id
      ) AS images,
      ARRAY (
        SELECT s.storage
        FROM storages AS s
        JOIN phones_storages AS ps
        ON ps.storage_id = s.id
        WHERE ps.phone_id = p.id
      ) as storage,
      ARRAY (
        SELECT r.ram
        FROM rams AS r
        JOIN phones_rams AS pr
        ON pr.ram_id = r.id
        WHERE pr.phone_id = p.id
      ) as ram,
      p.ts_os,
      p.ts_os_version,
      p.ts_os_procesor,
      p.ts_os_speed,
      p.ts_phy_dimen,
      p.ts_phy_weight,
      p.ts_phy_sim,
      p.ts_phy_cable,
      sc.screen AS ts_scr_size,
      p.ts_scr_tech,
      p.ts_scr_px,
      p.ts_scr_secu,
      p.ts_cam_main,
      p.ts_cam_front,
      p.ts_bat_type,
      p.ts_bat_char_t,
      p.ts_bat_char,
      p.ts_net_other,
      p.ts_other

      FROM phones AS p

      JOIN brands AS b
        ON p.brand_id = b.id

      JOIN screens AS sc
        ON p.screen_id = sc.id

      WHERE p.id = ${phoneId }

      GROUP BY b.brand, p.id, sc.screen
    `
    const { rows: data } = await (await db).query(onePhone)

    if (!data) throw new Error('Phones couldn\t be retrieved')

    return data
  } catch (error) {
    console.log('Error at quiery [getOnePhone]: ', error)
    return false
  }
}

module.exports = {
  getOnePhone,
}
