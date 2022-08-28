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

// 🔴 STORAGES IS LEAVING A PRODUCT OUT

async function getFilteredPhones(db, { filters }) {
  try {
    console.log({ filters })

    const filterQueries = [sql`TRUE`]
    const orderQueries = [sql`TRUE`]

    if (filters.brands) {
      if (Array.isArray(filters.brands)) {
        filterQueries.push(
          sql`b.brand IN (${sql.join(filters.brands, sql`, `)})`
        )
      } else {
        filterQueries.push(sql`b.brand = ${filters.brands}`)
      }
    }

    if (filters.price_GT || filters.price_LT) {
      if (filters.price_GT) {
        filterQueries.push(sql`p.price >= ${filters.price_GT}`)
      }
      if (filters.price_LT) {
        filterQueries.push(sql`p.price <= ${filters.price_LT}`)
      }
    }

    if (filters.storages) {
      if (Array.isArray(filters.storages)) {
        filterQueries.push(
          sql`s.storage IN (${sql.join(filters.storages, sql`, `)})`
        )
      } else {
        filterQueries.push(sql`s.storage = ${filters.storages}`)
      }
    }

    if (filters.colors) {
      if (Array.isArray(filters.colors)) {
        filterQueries.push(
          sql`c.color IN (${sql.join(filters.colors, sql`, `)})`
        )
      } else {
        filterQueries.push(sql`c.color = ${filters.colors}`)
      }
    }

    if (filters.order_by) {
      if (filters.order_by == 'price ASC') orderQueries.push(sql`p.price`)
      if (filters.order_by == 'price DESC') orderQueries.push(sql`p.price DESC`)
      if (filters.order_by == 'name ASC') orderQueries.push(sql`p.name`)
      if (filters.order_by == 'name DESC') orderQueries.push(sql`p.name DESC`)
    }

    const filteredSQL = sql.join(filterQueries, sql` AND `)
    const orderSQL = sql.join(orderQueries, sql`, `)

    const query = sql`
      ${allPhones} 
      WHERE ${filteredSQL} 
      GROUP BY b.brand, p.id
      ORDER BY ${orderSQL}`

    const { rows: data } = await (await db).query(query)

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
