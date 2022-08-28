const { sql } = require('slonik')

const allPhones = sql`
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
JOIN phones_storages AS ps
  ON ps.phone_id = p.id
JOIN storages AS s
  ON ps.storage_id = s.id
`

async function getFilteredPhones(db, { filters }) {
  try {
    console.log(filters)

    const queries = [sql`TRUE`]

    // ✅ brand
    if (filters.brands) {
      if (Array.isArray(filters.brands)) {
        queries.push(sql`b.brand IN (${sql.join(filters.brands, sql`, `)})`)
      } else {
        queries.push(sql`b.brand = ${filters.brands}`)
      }
    }
    // ✅ prices
    if (filters.price_GT || filters.price_LT) {
      if (filters.price_GT) {
        queries.push(sql`p.price >= ${filters.price_GT}`)
      }
      if (filters.price_LT) {
        queries.push(sql`p.price <= ${filters.price_LT}`)
      }
    }
    // ✅ storages
    if (filters.storages) {
      if (Array.isArray(filters.storages)) {
        queries.push(sql`s.storage IN (${sql.join(filters.storages, sql`, `)})`)
      } else {
        queries.push(sql`s.storage = ${filters.storages}`)
      }
    }

    // 🟨 color

    // Query constructor
    const filteredSQL = sql.join(queries, sql` AND `)

    const { rows: data } = await (
      await db
    ).query(sql`${allPhones} \n WHERE ${filteredSQL} GROUP BY b.brand, p.id`)

    if (!data) throw new Error('Phones couldn\t be retrieved')

    return data
  } catch (error) {
    console.log('Error at query [getFilteredPhones]: ', error)
    return false
  }
}

module.exports = {
  getFilteredPhones,
}
