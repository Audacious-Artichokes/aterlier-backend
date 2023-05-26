/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
});

pool
  .connect()
  .then(() => console.log('Connected'))
  .catch((err) => console.log('CONNECTION ERROR ', err.stack));

pool.on('end', () => console.log('Disconnected'));

module.exports = pool;

// pool.query(`SELECT * FROM ${process.env.PGDATABASE}`, (err, results) => {
//   if (!err) {
//     console.log(results.rows);
//   }
//   pool.end();
// });
