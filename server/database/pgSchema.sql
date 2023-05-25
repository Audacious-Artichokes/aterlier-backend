\c postgres;

DROP DATABASE IF EXISTS sdcproduct;

CREATE DATABASE sdcproduct;

\c sdcproduct;

CREATE TABLE IF NOT EXISTS product (
  product_id serial PRIMARY KEY,
  name VARCHAR(2000),
  slogan  VARCHAR(2000),
  description VARCHAR(2000),
  category VARCHAR(100),
  default_price NUMERIC(20, 2)
  );

CREATE TABLE IF NOT EXISTS related (
  related_id serial PRIMARY KEY,
  product_id1  serial,
  product_id2  serial,
  FOREIGN KEY (product_id1)
    REFERENCES product (product_id),
  FOREIGN KEY (product_id2)
    REFERENCES product (product_id)
);

CREATE TABLE IF NOT EXISTS feature (
  feature_id serial PRIMARY KEY,
  product_id  serial,
  feature  VARCHAR(100),
  value  VARCHAR(100),
  FOREIGN KEY (product_id)
    REFERENCES product (product_id)
);

CREATE TABLE IF NOT EXISTS style (
  style_id serial PRIMARY KEY,
  product_id  serial,
  name VARCHAR(200),
  sale_price  NUMERIC(20, 2) NULL,
  original_price NUMERIC(20, 2),
  default_style BOOLEAN,
  FOREIGN KEY (product_id)
    REFERENCES product (product_id)
);

CREATE TABLE IF NOT EXISTS photo (
  photo_id serial PRIMARY KEY,
  style_id serial,
  product_id  serial,
  thumbmail_url VARCHAR(100000),
  url VARCHAR(100000),
  FOREIGN KEY (product_id)
    REFERENCES product (product_id),
  FOREIGN KEY (style_id)
    REFERENCES style (style_id)
);

CREATE TABLE IF NOT EXISTS sku (
  sku_id serial PRIMARY KEY,
  style_id serial,
  product_id  serial,
  qty INT,
  size VARCHAR(10),
  FOREIGN KEY (product_id)
    REFERENCES product (product_id),
  FOREIGN KEY (style_id)
    REFERENCES style (style_id)
);
