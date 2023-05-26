const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');

const pgPool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
})

// const pgClient = await pgPool.connect()
//   .then((nClient) => {
//     console.log('Pool connect to PG db. \n');
//     return nClient;
//   })
//   .catch((error) => console.log('Error at connection: ', error));

// const pgClient = new Client({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   port: process.env.PGPORT,
// });

const countlines = (fp) => new Promise((resolve, reject) => {
  let count = 0;
  fs.createReadStream(fp)
    .on('data', (chunk) => {
      for (let i = 0; i < chunk.length; i += 1) {
        if (chunk[i] === 10) { count += 1; }
      }
    })
    .on('error', (error) => reject(error))
    .on('end', () => resolve(count));
});

const validatePGDatabase = async () => {
  if (Number(process.env.PG_INIT)) {
    const client = pgPool;

    console.log('-- VALIDATING DATA LOADED --');

    // Product
    let csvLineCount = await countlines(path.join(__dirname, '../data/product.csv'));
    let queryLineCount = await client.query('SELECT COUNT(product_id) FROM product');
    console.log('Product data records uploaded correctly: ', csvLineCount === Number(queryLineCount.rows[0].count));

    // Related
    csvLineCount = await countlines(path.join(__dirname, '../data/related.csv'));
    queryLineCount = await client.query('SELECT COUNT(related_id) FROM related');
    console.log('Related data records uploaded correctly: ', csvLineCount - 58 === Number(queryLineCount.rows[0].count));

    // Feature
    csvLineCount = await countlines(path.join(__dirname, '../data/features.csv'));
    queryLineCount = await client.query('SELECT COUNT(feature_id) FROM feature');
    console.log('Features data records uploaded correctly: ', csvLineCount === Number(queryLineCount.rows[0].count));

    // Style
    csvLineCount = await countlines(path.join(__dirname, '../data/styles.csv'));
    queryLineCount = await client.query('SELECT COUNT(style_id) FROM style');
    console.log('Styles data records uploaded correctly: ', csvLineCount === Number(queryLineCount.rows[0].count));

    // Photo
    csvLineCount = await countlines(path.join(__dirname, '../data/photos.csv'));
    queryLineCount = await client.query('SELECT COUNT(photo_id) FROM photo');
    console.log('Photos data records uploaded correctly: ', csvLineCount === Number(queryLineCount.rows[0].count));
    console.log(csvLineCount, queryLineCount.rows);

    // SKU
    csvLineCount = await countlines(path.join(__dirname, '../data/skus.csv'));
    queryLineCount = await client.query('SELECT COUNT(sku_id) FROM sku');
    console.log('SKUs data records uploaded correctly: ', csvLineCount === Number(queryLineCount.rows[0].count));
  }
};

validatePGDatabase();

module.exports = pgPool;
