const { Pool, Client } = require('pg');
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const csv = require('csv-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// eslint-disable-next-line import/prefer-default-export
const reviewPool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  port: process.env.DBPORT,
});

async function connectAndCreateSchema() {
  const client = new Client({
    database: 'reviews',
  });

  try {
    await client.connect();
    console.log('Database connection successful');
    // Rest of your code...
  } catch (error) {
    console.error('Error connecting to database:', error);
  }

  await client.query(
    `
    CREATE INDEX idx_chars_characteristic_id
    ON chars(characteristic_id);

    CREATE INDEX idx_revs_product_id
    ON revs(product_id);

    CREATE INDEX idx_revphotos_review_id
    ON revphotos(review_id);

    CREATE TABLE charsinfo (
      id SERIAL primary key,
      product_id int,
      name varchar(50)
    );

    CREATE TABLE revs (
      id SERIAL primary key,
      product_id int,
      rating int,
      date bigint,
      summary varchar(500),
      body varchar(500),
      recommend boolean,
      reported boolean,
      reviewer_name varchar(500),
      reviewer_email varchar(500),
      response varchar(500) null,
      helpfulness int
    );

    CREATE TABLE chars (
      id SERIAL primary key,
      characteristic_id SERIAL,
      review_id int REFERENCES revs(id),
      value int
    );

    CREATE TABLE revPhotos (
      id SERIAL PRIMARY KEY,
      review_id INT REFERENCES revs(id),
      url VARCHAR(500)
      );
    `,

  );
  client.end();
}
// connectAndCreateSchema();

module.exports = reviewPool;
