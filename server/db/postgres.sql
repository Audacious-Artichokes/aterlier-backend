DROP TABLE IF EXISTS revs;
DROP TABLE IF EXISTS meta;

CREATE TABLE revs (
  review_id SERIAL primary key,
  product int,
  rating int,
  summary varchar(100),
  recommend boolean,
  response varchar(100),
  body varchar(100),
  review_name varchar(30),
  helpfulness int,
  photos JSONB
);

CREATE TABLE meta (
  product_id int primary key,
  ratings JSONB,
  recommended int,
  characteristics JSONB
)

