const { sql } = require('slonik')

async function addOnePhone(db, { items }) {
  try {
    // 🔴 INSERT PHONE RETURNING ID
    const phoneInfo = sql`
      SELECT *
      FROM brands
    `

    const { rows: data } = await (await db).query(phoneInfo)

    console.log(data)

    if (!data) throw new Error('Phones couldn\t be retrieved')

    return 'Phone created'
  } catch (error) {
    console.log('Error at quiery [addOnePhone]: ', error)
    return false
  }
}

module.exports = {
  addOnePhone,
}
