const { sql } = require('slonik')

async function getFilters(db) {
  try {
    return (await db).transaction(async (tx) => {
      const data = {
        colors: [],
        brands: [],
        prices: [],
        storages: [],
      }

      // add screen ?

      const { rows: colors } = await tx.query(sql`
        SELECT color
        FROM colors
        ORDER BY color ASC
      `)
      colors.forEach((elm) => data.colors.push(elm.color))

      const { rows: brands } = await tx.query(sql`
        SELECT brand
        FROM brands
        ORDER BY brand ASC
      `)
      brands.forEach((elm) => data.brands.push(elm.brand))

      const { rows: storages } = await tx.query(sql`
        SELECT storage
        FROM storages
        ORDER BY storage ASC
      `)
      storages.forEach((elm) => data.storages.push(elm.storage))

      const { rows: prices } = await tx.query(sql`
        SELECT DISTINCT price
        FROM phones
        ORDER BY price ASC
      `)
      prices.forEach((elm) => data.prices.push(elm.price))

      return data
    })
  } catch (error) {
    console.log('Error at quiery [getAllPhones]: ', error)
    return false
  }
}

module.exports = {
  getFilters,
}
