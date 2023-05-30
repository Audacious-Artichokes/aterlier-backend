const pgPool = require('../database/db');

const getProduct = (productId) => ({
  // product * feature tables
  // fields: product_id, name, slogan, description, categroy, default_price, features
  text: `
    SELECT
      product.product_id AS id,
      name,
      slogan,
      category,
      default_price,
      (
        SELECT json_agg(feature_list)
        FROM (
          SELECT
            feature,
            value
          FROM feature
          WHERE product_id = $1
        ) AS feature_list
      ) AS features
    FROM product
    WHERE product_id = $1
  `,
  values: [productId],
});

const getStyle = (productId) => ({
  text: `
  SELECT
    style_id,
    name,
    original_price,
    sale_price,
    default_style as "default?",
    (
      SELECT json_agg(nested_photos)
      FROM (
        SELECT
          thumbnail_url,
          url
        FROM photo
        WHERE photo.style_id = style.style_id
      ) AS nested_photos
    ) as photos,
    (
      SELECT json_object_agg(
        sku.sku_id,
        json_build_object(
          'quantity', sku.quantity,
          'size', sku.size
        )
      )
      FROM (
        SELECT DISTINCT ON (sku_id)
          sku_id,
          qty AS quantity,
          size
        FROM sku
        WHERE sku.style_id = style.style_id
      ) sku
    ) as skus
  FROM style
  WHERE product_id = $1`,
  values: [productId],
});

const getRelated = (productId) => ({
  text: `
  SELECT ARRAY_AGG(DISTINCT product_id) AS product_id
  FROM (
    SELECT product_id2 AS product_id
    FROM related
    WHERE product_id1 = $1
    UNION
    SELECT product_id1 AS product_id
    FROM related
    WHERE product_id2 = $1
  ) AS subquery;
  `,
  values: [productId],
});

module.exports.product = {
  getAll: (req, res) => {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;

    pgPool.query(
      `SELECT
        product_id AS id,
        name,
        slogan,
        description,
        category,
        default_price
      FROM product
      WHERE (product_id >= $1 AND product_id <= $2)`,
      [count * (page - 1) + 1, count * page],
    )
      .then(({ rows }) => res.status(200).send(rows))
      .catch(({ message }) => res.status(500).send(message));
  },

  getProduct: (req, res) => {
    const productId = req.query.product_id || req.params.product_id;

    pgPool.query(getProduct(productId))
      .then(({ rows }) => res.status(200).send(rows[0]))
      .catch(({ message }) => res.status(500).send(message));
  },

  getStyles: (req, res) => {
    const productId = req.query.product_id || req.params.product_id;

    pgPool.query(getStyle(productId))
      .then(({ rows }) => res.status(200).send({
        product_id: productId,
        results: rows,
      }))
      .catch(({ message }) => res.status(500).send(message));
  },

  getRelated: (req, res) => {
    const productId = Number(req.query.product_id || req.params.product_id);

    pgPool.query(getRelated(productId))
      .then(({ rows }) => res.status(200).send(rows[0].product_id))
      .catch(({ message }) => res.status(500).send(message));
  },
};
