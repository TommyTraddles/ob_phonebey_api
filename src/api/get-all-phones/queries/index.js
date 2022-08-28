const { sql } = require('slonik')

async function getAllPhones(db) {
  try {
    const { rows: data } = await (
      await db
    ).query(sql`
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
       ) as color,
        ARRAY(
          SELECT i.url 
          FROM images AS i
          WHERE i.phone_id = p.id
          LIMIT 1
          ) AS images
      FROM phones AS p
      JOIN brands AS b
        ON p.brand_id = b.id
      JOIN phones_colors AS pc
        ON pc.phone_id = p.id
      JOIN colors AS c
        ON pc.color_id = c.id
      GROUP BY b.brand, p.id
    ;`)

    if (!data) throw new Error('Phones couldn\t be retrieved')

    return data
  } catch (error) {
    console.log('Error at quiery [getAllPhones]: ', error)
  }
}

module.exports = {
  getAllPhones,
}
