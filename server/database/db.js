const { Pool, Client } = require('pg');
// const pgPoolReset = require('./pg.sql');

const loadDb = 'psql'; // Options: psql, mongodb
const reset = false;

const pgPool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  // database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

const pgClient = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// const pgPoolCheckout = (inputQuery) => {
//   pgPool.connect()
//     .then((client) => client
//       .query(inputQuery)
//       .then((result) => {
//         console.log(result);
//         client.release();
//       })
//       .catch((error) => {
//         client.release();
//         console.log(error);
//       }));
// };

const resetDatabase = async () => {
  if (reset) {
    // Parameters can only be used to SELECT, INSERT, DELETE
    const actions = [
      'DROP DATABASE IF EXISTS sdcproduct',
      'CREATE DATABASE sdcproduct',
      `CREATE TABLE product (
        product_id serial PRIMARY KEY
        name
        )`,
      // 'DROP TABLE test',
      // 'CREATE TABLE test1 ( exmployeeId int )',
      // 'DROP TABLE test1',
    ];

    await pgClient.connect();

    actions.forEach(async (query) => {
      console.log('PENDING:', query);
      // await pgClient.connect();
      await pgClient
        .query(query)
        .then((result) => console.log(result))
        .catch((error) => console.log(error.stack))
        // .then(() => pgClient.end());
    });

    // await pgClient.end();
  }
};

resetDatabase();
pgPool.end();

module.exports.db = { pgClient };
