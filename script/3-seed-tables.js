const db = require('../src/config/database')
const { createPhones } = require('../src/api/post-one/queries')
const { sql } = require('slonik')
const path = require('path')
const fs = require('fs')

module.exports = async ({ sourceDir }) => {
  console.info('🚀 Starting table insertion')

  // 🔴 SCAFOLD TO INCLUDE LOGIN ON POST-ONE

  // failed CSV upload (returned error: file not found)
  // failed composed queries (returnet error near $1)

  try {
    const { brands } = JSON.parse(
      await fs.promises.readFile(path.join(sourceDir, 'brands.json'))
    )
    const { rams } = JSON.parse(
      await fs.promises.readFile(path.join(sourceDir, 'rams.json'))
    )
    const { colors } = JSON.parse(
      await fs.promises.readFile(path.join(sourceDir, 'colors.json'))
    )
    const { screens } = JSON.parse(
      await fs.promises.readFile(path.join(sourceDir, 'screens.json'))
    )
    const { storages } = JSON.parse(
      await fs.promises.readFile(path.join(sourceDir, 'storages.json'))
    )
    const { phones } = JSON.parse(
      await fs.promises.readFile(path.join(sourceDir, 'phones.json'))
    )

    const result = await createPhones(db, {
      phones,
      rams,
      brands,
      colors,
      storages,
      screens,
    })

    if (!result) {
      throw new Error("Phone couldn't be created")
    }

    console.info('✔ [ phones inserted ]')
    console.info('✅ Insertion done')
  } catch (error) {
    console.error('> ❌ [Error] inserting JSON into database')
    console.error('>', error)
  }
}
