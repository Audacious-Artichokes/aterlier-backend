\c sdcproduct

SELECT * FROM bench(
    'SELECT * FROM product WHERE product_id=(SELECT floor(random() * 1000011)::int)',
    1000,
    'product',
    'CORRECT index on product_id'
  );

SELECT * FROM bench(
    'SELECT * FROM feature WHERE product_id=(SELECT floor(random() * 1000011)::int)',
    1000,
    'feature',
    'CORRECT index on product_id'
  );

SELECT * FROM bench(
    'SELECT * FROM sku WHERE product_id=(SELECT floor(random() * 1000011)::int)',
    1000,
    'sku',
    'CORRECT index on product_id'
  );

SELECT * FROM bench('
    SELECT * FROM style WHERE product_id=(SELECT floor(random() * 1000011)::int)',
    1000,
    'style',
    'CORRECT index on product_id'
  );

SELECT * FROM bench('
    SELECT * FROM photo WHERE product_id=(SELECT floor(random() * 1000011)::int)',
    1000,
    'photo',
    'CORRECT index on product_id'
  );

-- SELECT * FROM bench(
--     format('
--       SELECT
--         product.product_id AS id,
--         name,
--         slogan,
--         category,
--         default_price,
--         (
--           SELECT jsonb_agg(features)
--           FROM (
--             SELECT
--               feature,
--               value
--             FROM feature
--             WHERE product_id = %1$s
--           )  AS features
--         )
--       FROM product
--       WHERE product_id = %1$s', floor(random() * 1000011)::int),
--     1000,
--     'product+feature',
--     'combine product+feature query, with not need for other formating'
--   );

SELECT * FROM bench(
    format('
      SELECT
        product_id,
        (
          SELECT jsonb_agg(nested_results)
          FROM (
            SELECT
              style_id,
              name,
              original_price,
              sale_price,
              default_style as "default?",
              (
                SELECT jsonb_agg(nested_photos)
                FROM (
                  SELECT
                    thumbnail_url,
                    url
                  FROM photo
                  WHERE photo.style_id = style.style_id
                ) AS nested_photos
              ) as photos
            FROM style
            WHERE product_id = 4000
          ) AS nested_results
        ) AS results
      FROM style
      WHERE product_id = 4000
      LIMIT 1;', floor(random() * 1000011)::int),
    1000,
    'product+style+photo',
    'combine product+style+photo query, limit 1, with not need for other formating, only 1000 interations, after indexing on style, photo (sytle_id)'
  );

-- SELECT xact_commit+xact_rollback FROM pg_stat_database WHERE datname = 'sdcproduct';

SELECT * FROM bench(
    format('
            SELECT
              style_id,
              name,
              original_price,
              sale_price,
              default_style as "default?",
              (
                SELECT jsonb_agg(nested_photos)
                FROM (
                  SELECT
                    thumbnail_url,
                    url
                  FROM photo
                  WHERE photo.style_id = style.style_id
                ) AS nested_photos
              ) as photos
            FROM style
            WHERE product_id = %1$s', floor(random() * 1000011)::int),
    1000,
    'product+style+photo',
    'combine product+style+photo query, no limit, with not need for other formating, only 1000 interations. after indexing on style, photo (sytle_id)'
  );


SELECT * FROM bench(
    format('
      SELECT ARRAY_AGG(DISTINCT product_id) AS product_ids
  FROM (
    SELECT product_id2 AS product_id
    FROM related
    WHERE product_id1 = %1$s
    UNION
    SELECT product_id1 AS product_id
    FROM related
    WHERE product_id2 = %1$s
  ) AS subquery;', floor(random() * 1000011)::int),
    1000,
    'related',
    'after index on product_id1 & product_id2, no formating required to response'
  );


SELECT * FROM bench(
    format('
      SELECT ARRAY_AGG(DISTINCT product_id) AS product_ids
  FROM (
    SELECT product_id2 AS product_id
    FROM related
    WHERE product_id1 = %1$s
    UNION
    SELECT product_id1 AS product_id
    FROM related
    WHERE product_id2 = %1$s
  ) AS subquery;', floor(random() * 1000011)::int),
    1000,
    'related',
    'after composite index on product_id1 & product_id2, no formating required to response'
  );