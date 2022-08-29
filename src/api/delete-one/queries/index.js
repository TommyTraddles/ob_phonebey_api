const { cloudinary } = require('../../../config/cloudinary')
const path = require('path')
const { sql } = require('slonik')

async function deleteImagesFromCloud(phoneId) {
  try {
    const prefix = path.join('phoneybey', phoneId)
    await cloudinary.api.delete_resources_by_prefix(prefix)
    await cloudinary.api.delete_folder(prefix)

    return true
  } catch ({ error }) {
    console.error('❌ Error at query [deleteImagesFromCloud]:', error.message)
    return false
  }
}

async function deleteOne(db, { phoneId }) {
  try {
    // select
    const { rowCount } = await (
      await db
    ).query(sql`
      SELECT id
      FROM phones
      WHERE id = ${phoneId}
    `)

    if (!rowCount) return 'Invalid phone id'

    return await (
      await db
    ).transaction(async (tx) => {
      await tx.query(sql`
        DELETE from phones_colors WHERE phone_id = ${phoneId};
      `)

      await tx.query(sql`
        DELETE from phones_rams WHERE phone_id = ${phoneId};
      `)

      await tx.query(sql`
        DELETE from phones_storages WHERE phone_id = ${phoneId};
      `)

      const action = await deleteImagesFromCloud(phoneId)
      if (!action) throw new Error("Images couldn't be deleted from cloudinary")

      await tx.query(sql`
        DELETE from images WHERE phone_id = ${phoneId};
      `)

      await tx.query(sql`
        DELETE from phones WHERE id = ${phoneId};
      `)

      /**
       *
       * 🔴 Delete unused row values on relationed tables
       *
       * Brands
       * Screens
       * Colors
       * Rams
       * Storages
       */

      return 'Phone deleted'
    })

    // delete
  } catch (error) {
    console.error('❌ Error at query [deleteOne]: ', error)
    return false
  }
}

module.exports = {
  deleteOne,
}
