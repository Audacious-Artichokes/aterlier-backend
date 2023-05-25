-- PRODUCT TABLE --
COPY product ( product_id, name, slogan, description, category, default_price) FROM '/Users/thanghnguyen/git_repos/hackreactor/sdc/atelier-backend-product/server/data/product.csv'
  DELIMITER ',' CSV HEADER;

-- RELATED TABLE --

CREATE TABLE IF NOT EXISTS temp_related (
  related_id serial PRIMARY KEY,
  product_id1  int,
  product_id2  int
);

COPY temp_related from '/Users/thanghnguyen/git_repos/hackreactor/sdc/atelier-backend-product/server/data/related.csv'
  DELIMITER ',' CSV HEADER;

INSERT INTO related (related_id, product_id1, product_id2)
  SELECT related_id, product_id1, product_id2
  FROM temp_related
  WHERE product_id2 != 0;

DROP TABLE IF EXISTS temp_related;

-- FEATURE TABLE --

COPY feature ( feature_id, product_id, feature, value ) FROM '/Users/thanghnguyen/git_repos/hackreactor/sdc/atelier-backend-product/server/data/features.csv'
  DELIMITER ',' CSV HEADER;

-- STYLE TABLE --

CREATE TABLE IF NOT EXISTS temp_style (
  style_id serial PRIMARY KEY,
  product_id  serial,
  name VARCHAR(200),
  sale_price  VARCHAR(200),
  original_price VARCHAR(200),
  default_style BOOLEAN
);

COPY temp_style FROM '/Users/thanghnguyen/git_repos/hackreactor/sdc/atelier-backend-product/server/data/styles.csv'
  DELIMITER ',' CSV HEADER;

INSERT INTO style ( style_id, product_id, name, sale_price, original_price, default_style )
  SELECT style_id, product_id, name,
    NULLIF(sale_price, 'null')::NUMERIC(20, 2),
    NULLIF(original_price, 'null')::NUMERIC(20, 2),default_style
  FROM temp_style;

DROP TABLE temp_style;

-- PHOTO TABLE --

CREATE TABLE IF NOT EXISTS temp_photo (
  photo_id serial PRIMARY KEY,
  style_id serial,
  thumbmail_url VARCHAR(100000),
  url VARCHAR(100000)
);

COPY temp_photo FROM '/Users/thanghnguyen/git_repos/hackreactor/sdc/atelier-backend-product/server/data/photos.csv'
  DELIMITER ',' CSV HEADER;

INSERT INTO photo (photo_id, style_id, product_id, thumbmail_url, url)
  SELECT
    photo_id, style_id,
    (SELECT product_id FROM style WHERE style_id = style.style_id LIMIT 1),
    thumbmail_url, url
  FROM temp_photo;

DROP TABLE temp_photo;`

-- SKU TABLE --

CREATE TABLE IF NOT EXISTS temp_sku (
  sku_id serial PRIMARY KEY,
  style_id serial,
  size VARCHAR(10),
  qty INT
);

COPY temp_sku FROM '/Users/thanghnguyen/git_repos/hackreactor/sdc/atelier-backend-product/server/data/skus.csv'
  DELIMITER ',' CSV HEADER;

INSERT INTO sku (sku_id, style_id, product_id, qty, size)
  SELECT
    sku_id, style_id,
    (SELECT product_id FROM style WHERE style_id = style.style_id LIMIT 1),
    qty, size
  FROM temp_sku;

DROP TABLE temp_sku;