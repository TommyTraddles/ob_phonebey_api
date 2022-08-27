const db = require('../src/config/database')
const { sql } = require('slonik')

module.exports = (async () => {
  console.info('🚀 Starting table creation')

  try {
    return (await db).transaction(async (tx) => {
      await tx.query(sql`
      DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
      DROP TABLE IF EXISTS brands CASCADE;
      DROP TABLE IF EXISTS screens CASCADE;
      DROP TABLE IF EXISTS phones CASCADE;
      DROP TABLE IF EXISTS images CASCADE;
      DROP TABLE IF EXISTS colors CASCADE;
      DROP TABLE IF EXISTS phones_colors CASCADE;
      DROP TABLE IF EXISTS rams CASCADE;
      DROP TABLE IF EXISTS phones_rams CASCADE;
      DROP TABLE IF EXISTS storages CASCADE;
      DROP TABLE IF EXISTS phones_storages CASCADE;
      `)
      await tx.query(sql`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS brands (
        id                 uuid            PRIMARY KEY default uuid_generate_v4(),
        brand              VARCHAR(20)     not null
      );
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS screens (
        id                 uuid            PRIMARY KEY default uuid_generate_v4(),
        screen             FLOAT           not null
      );      
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS phones (
        id                 uuid            PRIMARY KEY default uuid_generate_v4(),
        brand_id           uuid            not null default uuid_generate_v4(),
        name               VARCHAR(30)     not null,
        price              MONEY           default 0,
        bestseller         BOOLEAN         default false,
        new                BOOLEAN         default false,
        ts_os              VARCHAR(50)     ,
        ts_os_version      VARCHAR(5)      ,   
        ts_os_procesor     VARCHAR(150)    ,
        ts_os_speed        VARCHAR(50)     ,
        ts_phy_dimen       VARCHAR(50)     ,
        ts_phy_weight      VARCHAR(10)     ,    
        ts_phy_sim         VARCHAR(50)     ,
        ts_phy_cable       VARCHAR(15)     ,
        screen_id          uuid            not null default uuid_generate_v4(),
        ts_scr_tech        VARCHAR(70)     ,
        ts_scr_px          VARCHAR(40)     ,
        ts_scr_secu        VARCHAR(60)     ,
        ts_cam_main        VARCHAR(220)    ,
        ts_cam_front       VARCHAR(40)     ,
        ts_bat_type        VARCHAR(50)     ,
        ts_bat_char_t      VARCHAR(100)    ,
        ts_bat_char        VARCHAR(100)    ,  
        ts_net_other       TEXT ARRAY      ,
        ts_other           TEXT ARRAY        
      );
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS images (
        id                 uuid            PRIMARY KEY default uuid_generate_v4(),
        phone_id           uuid            not null default uuid_generate_v4(),
        url                VARCHAR(500)    not null  
      );
      
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS colors (
        id                 uuid            PRIMARY KEY default uuid_generate_v4(),
        color              VARCHAR(20)     not null
      );
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS phones_colors (
        id                 uuid            PRIMARY KEY default uuid_generate_v4(),
        phone_id           uuid            not null default uuid_generate_v4(),
        color_id           uuid            not null default uuid_generate_v4()
      );
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS rams (
        id                 uuid            PRIMARY KEY default uuid_generate_v4(),
        ram                INTEGER    not null
      );
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS phones_rams (
        id                 uuid            PRIMARY KEY default uuid_generate_v4(),
        phone_id           uuid            not null default uuid_generate_v4(),
        ram_id             uuid            not null default uuid_generate_v4()
      );
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS storages (
        id                 uuid            PRIMARY KEY default uuid_generate_v4(),
        storage            INTEGER         not null
      );
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS phones_storages (
        id                 uuid            PRIMARY KEY default uuid_generate_v4(),
        phone_id           uuid            not null default uuid_generate_v4(),
        storage_id         uuid            not null default uuid_generate_v4()
      );
      `)
      console.info('✔ [ Tables created ]')
      await tx.query(sql`
      ALTER TABLE brands
        ADD CONSTRAINT brand_unique UNIQUE(brand);
      `)
      await tx.query(sql`
      ALTER TABLE screens
        ADD CONSTRAINT screen_unique UNIQUE(screen);
      `)
      await tx.query(sql`
      ALTER TABLE colors
        ADD CONSTRAINT color_unique UNIQUE(color);
      `)
      await tx.query(sql`
      ALTER TABLE rams
        ADD CONSTRAINT ram_unique UNIQUE(ram);
      `)
      await tx.query(sql`
      ALTER TABLE storages
        ADD CONSTRAINT storage_unique UNIQUE(storage);
      `)
      await tx.query(sql`
      ALTER TABLE phones
      ADD CONSTRAINT phone_unique UNIQUE(name),
        ADD FOREIGN KEY(brand_id) REFERENCES brands(id),
        ADD FOREIGN KEY(screen_id) REFERENCES screens(id);
      `)
      await tx.query(sql`
      ALTER TABLE images
        ADD CONSTRAINT image_unique UNIQUE(url),
        ADD FOREIGN KEY(phone_id) REFERENCES phones(id);
      `)
      await tx.query(sql`
      ALTER TABLE phones_colors
        ADD FOREIGN KEY(color_id) REFERENCES colors(id),
        ADD FOREIGN KEY(phone_id) REFERENCES phones(id);
      `)
      await tx.query(sql`
      ALTER TABLE phones_rams
        ADD FOREIGN KEY(ram_id) REFERENCES rams(id),
        ADD FOREIGN KEY(phone_id) REFERENCES phones(id);
      `)
      await tx.query(sql`
      ALTER TABLE phones_storages
        ADD FOREIGN KEY(storage_id) REFERENCES storages(id),
        ADD FOREIGN KEY(phone_id) REFERENCES phones(id);
      `)
      console.info('✔ [ relations and constraints created ]')
      console.info('✅ tables created')
    })
  } catch (error) {
    console.info('> ❌ [Error] creating the tables')
    console.info('>', error)
  }
})()
