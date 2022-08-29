const db = require('../src/config/database')
const { sql } = require('slonik')

module.exports = (async () => {
  try {
    return (await db).transaction(async (tx) => {
      await tx.query(sql`
        DELETE FROM phones_colors CASCADE;
      `)
      await tx.query(sql`
        DELETE FROM phones_rams CASCADE;
      `)
      await tx.query(sql`
        DELETE FROM phones_storages CASCADE;
      `)
      await tx.query(sql`
        DELETE FROM images CASCADE;
      `)
      await tx.query(sql`
        DELETE FROM phones CASCADE;
      `)
      await tx.query(sql`
        DELETE FROM rams CASCADE;
      `)
      await tx.query(sql`
        DELETE FROM brands CASCADE;
      `)
      await tx.query(sql`
        DELETE FROM screens CASCADE;
      `)
      await tx.query(sql`
        DELETE FROM storages CASCADE;
      `)
    })
  } catch (error) {
    console.error('> ❌ [Error] deleting entries')
    console.error('>', error)
  }
})()
