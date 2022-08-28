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
`

async function getAllPhones(db) {
  try {
    const { rows: data } = await (await db).query(sql`${allPhones}`)
    if (!data) throw new Error('Phones couldn\t be retrieved')
    return data
  } catch (error) {
    console.log('Error at quiery [getAllPhones]: ', error)
    return false
  }
}

async function getFilteredPhones(db, { filters }) {
  try {
    console.log(filters)

    const filteredSQL = [sql`TRUE`]

    // ✅ brand
    if (filters.brands) {
      if (Array.isArray(filters.brands)) {
        filteredSQL.push(sql`b.brand IN (${sql.join(filters.brands, sql`, `)})`)
      } else {
        filteredSQL.push(sql`b.brand = ${filters.brands[0]}`)
      }
    }
    // 🟨 storages
    // 🟨 prices
    // 🟨 color

    // 🔴 Query constructor
    const whereSqlToken = sql.join(filteredSQL, sql` \nAND `)

    // execture query
    // WHERE ${whereSqlToken}

    // ❌ ALL PHONES RETURN ERROR
    const query =
      filteredSQL.length == 1
        ? sql`${allPhones}`
        : sql`${allPhones} \n WHERE ${whereSqlToken} GROUP BY b.brand, p.id`

    console.log('🔴 QUERY: ', query)

    const { rows: data } = await (await db).query(sql`${query}`)
    if (!data) throw new Error('Phones couldn\t be retrieved')
    return data
  } catch (error) {
    console.log('Error at query [getFilteredPhones]: ', error)
    return false
  }
}

module.exports = {
  getAllPhones,
  getFilteredPhones,
}
