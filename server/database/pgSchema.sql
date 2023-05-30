\c postgres;

CREATE DATABASE sdcproduct;

DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS related;
DROP TABLE IF EXISTS feature;
DROP TABLE IF EXISTS style;
DROP TABLE IF EXISTS photo;
DROP TABLE IF EXISTS sku;

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

CREATE INDEX product1_related_idx ON related (product_id1);
CREATE INDEX product2_related_idx ON related (product_id2);
CREATE INDEX comp_product1_product2_related_idx ON related (product_id1, product_id2);

CREATE TABLE IF NOT EXISTS feature (
  feature_id serial PRIMARY KEY,
  product_id  serial,
  feature  VARCHAR(100),
  value  VARCHAR(100),
  FOREIGN KEY (product_id)
    REFERENCES product (product_id)
);

CREATE INDEX product_feature_idx on feature (product_id);

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

CREATE INDEX product_style_idx on style (product_id);

CREATE TABLE IF NOT EXISTS photo (
  photo_id serial PRIMARY KEY,
  style_id serial,
  product_id  serial,
  thumbnail_url VARCHAR(100000),
  url VARCHAR(100000),
  FOREIGN KEY (product_id)
    REFERENCES product (product_id),
  FOREIGN KEY (style_id)
    REFERENCES style (style_id)
);

-- CREATE INDEX product_photo_idx on photo (product_id);
CREATE INDEX style_photo_idx on photo (style_id);

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

CREATE INDEX style_sku_idx on sku (style_id);