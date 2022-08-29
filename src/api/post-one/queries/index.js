const { cloudinary } = require('../../../config/cloudinary')
const { sql } = require('slonik')
const fs = require('fs')

async function uploadImage({ phoneId, image }) {
  try {
    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      format: 'jpg',
      overwrite: true,
      folder: `phonebey/${phoneId}`,
      use_filename: true,
      unique_filename: false,
    })
    if (!secure_url) throw new Error('Cannot upload the image to Cloudinary')

    await fs.promises.unlink(image.path)

    return secure_url
  } catch (error) {
    console.error('❌ Error at query [uploadImage]: ', error)
    return false
  }
}

async function createPhones(
  db,
  { phones, rams, brands, colors, storages, screens }
) {
  try {
    // DATABASE KEY IDs
    const ramIds = {}
    const brandIds = {}
    const colorIds = {}
    const phonesIds = {}
    const screenIds = {}
    const storageIds = {}

    return (await db).transaction(async (tx) => {
      // VARIATIONS QUERIES
      for (let brand of brands) {
        const {
          rows: [result],
        } = await tx.query(sql`
        SELECT brand, id
        FROM brands
        WHERE brand = ${brand};
      `)
        if (result?.brand == brand) {
          brandIds[brand] = result?.id
          continue
        }

        const {
          rows: [{ id }],
        } = await tx.query(sql`
          INSERT INTO brands (brand)
          VALUES (${brand})
          RETURNING id;
        `)
        brandIds[brand] = id
      }

      for (let ram of rams) {
        const {
          rows: [result],
        } = await tx.query(sql`
        SELECT ram, id
        FROM rams
        WHERE ram = ${ram};
      `)
        if (result?.ram == ram) {
          ramIds[ram] = result?.id
          continue
        }

        const {
          rows: [{ id }],
        } = await tx.query(sql`
        INSERT INTO rams (ram)
        VALUES (${ram})
        RETURNING id;
      `)
        ramIds[ram] = id
      }

      for (let color of colors) {
        const {
          rows: [result],
        } = await tx.query(sql`
        SELECT color, id
        FROM colors
        WHERE color = ${color};
      `)
        if (result?.color == color) {
          colorIds[color] = result?.id
          continue
        }

        const {
          rows: [{ id }],
        } = await tx.query(sql`
        INSERT INTO colors (color)
        VALUES (${color})
        RETURNING id;
      `)
        colorIds[color] = id
      }

      for (let screen of screens) {
        const {
          rows: [result],
        } = await tx.query(sql`
        SELECT screen, id
        FROM screens
        WHERE screen = ${screen};
      `)
        if (result?.screen == screen) {
          screenIds[screen] = result?.id
          continue
        }

        const {
          rows: [{ id }],
        } = await tx.query(sql`
        INSERT INTO screens (screen)
        VALUES (${screen})
        RETURNING id;
      `)
        screenIds[screen] = id
      }

      for (let storage of storages) {
        const {
          rows: [result],
        } = await tx.query(sql`
        SELECT storage, id
        FROM storages
        WHERE storage = ${storage};
      `)
        if (result?.storage == storage) {
          storageIds[storage] = result?.id
          continue
        }

        const {
          rows: [{ id }],
        } = await tx.query(sql`
        INSERT INTO storages (storage)
        VALUES (${storage})
        RETURNING id;
      `)
        storageIds[storage] = id
      }

      let data

      // PHONE QUERIES
      for (let phone of phones) {
        const {
          rows: [result],
        } = await tx.query(sql`
        SELECT name, id
        FROM phones
        WHERE name = ${phone.name};
      `)

        if (result?.name != phone.name) {
          const brand_id = brandIds[phone.brand]
          const screen_id = screenIds[phone.ts_scr_size]
          const ts_other = phone.ts_other
            ? sql.array(phone.ts_other, 'text')
            : null

          const {
            rows: [{ id }],
          } = await tx.query(sql`
          INSERT INTO phones
            (
              brand_id,
              name,
              screen_id,
              bestseller,
              new,
              price,
              ts_os,
              ts_os_version,
              ts_os_procesor,
              ts_os_speed,
              ts_phy_dimen,
              ts_phy_weight,
              ts_phy_sim,
              ts_phy_cable,
              ts_scr_tech,
              ts_scr_px,
              ts_scr_secu,
              ts_cam_main,
              ts_cam_front,
              ts_bat_type,
              ts_bat_char_t,
              ts_bat_char,
              ts_net_other,
              ts_other
            )
          VALUES
            (
              ${brand_id},
              ${phone.name},
              ${screen_id},
              ${phone.bestseller},
              ${phone.new},
              ${phone.price},
              ${phone.ts_os},
              ${phone.ts_os_version},
              ${phone.ts_os_procesor},
              ${phone.ts_os_speed},
              ${phone.ts_phy_dimen},
              ${phone.ts_phy_weight},
              ${phone.ts_phy_sim},
              ${phone.ts_phy_cable},
              ${phone.ts_scr_tech},
              ${phone.ts_scr_px},
              ${phone.ts_scr_secu},
              ${phone.ts_cam_main},
              ${phone.ts_cam_front},
              ${phone.ts_bat_type},
              ${phone.ts_bat_char_t},
              ${phone.ts_bat_char},
              ${sql.array(phone.ts_net_other, 'text')},
              ${ts_other}
            )
          RETURNING id;
      `)
          phonesIds[phone.name] = id
          data = {
            phone_id: id,
            message: 'Phone successfully created',
          }

          if (phone.images) {
            for (let image of phone.images) {
              if (typeof image != 'string') {
                const url = await uploadImage({
                  phoneId: phonesIds[phone.name],
                  image,
                })
                if (!url) throw new Error('URL cannot be retrieved')
                image = url
              }

              const {
                rows: [result],
              } = await tx.query(sql`
              SELECT url, id
              FROM images
              WHERE phone_id = ${phonesIds[phone.name]};
            `)
              if (result?.url == image) continue
              await tx.query(sql`
              INSERT INTO images(phone_id, url)
              VALUES (${phonesIds[phone.name]}, ${image})
            `)
            }
          }

          if (phone.colors) {
            for (let color of phone.colors) {
              const { rowCount } = await tx.query(sql`
              SELECT id
              FROM phones_colors
              WHERE phone_id = ${phonesIds[phone.name]} AND color_id = ${
                colorIds[color]
              }
        `)
              if (rowCount) continue
              await tx.query(sql`
              INSERT INTO phones_colors(phone_id, color_id)
              VALUES (${phonesIds[phone.name]}, ${colorIds[color]})
        `)
            }
          }

          if (phone.mm_ram) {
            for (let ram of phone.mm_ram) {
              const { rowCount } = await tx.query(sql`
            SELECT id
            FROM phones_rams
            WHERE phone_id = ${phonesIds[phone.name]} AND ram_id = ${
                ramIds[ram]
              }
            `)
              if (rowCount) continue
              await tx.query(sql`
              INSERT INTO phones_rams(phone_id, ram_id)
              VALUES (${phonesIds[phone.name]}, ${ramIds[ram]})
        `)
            }
          }

          if (phone.mm_stg) {
            for (let storage of phone.mm_stg) {
              const { rowCount } = await tx.query(sql`
            SELECT id
            FROM phones_storages
            WHERE phone_id = ${phonesIds[phone.name]} AND storage_id = ${
                storageIds[storage]
              }
            `)
              if (rowCount) continue
              await tx.query(sql`
              INSERT INTO phones_storages(phone_id, storage_id)
              VALUES (${phonesIds[phone.name]}, ${storageIds[storage]})
        `)
            }
          }
        } else {
          phonesIds[phone.name] = result?.id
          data = {
            phone_id: result?.id,
            message:
              'Another phone shares the exact same name, please chage it',
          }
        }
      }
      return data
    })
  } catch (error) {
    console.log('❌ Error at query [createPhones]: ', error)
    return false
  }
}

module.exports = {
  createPhones,
}
