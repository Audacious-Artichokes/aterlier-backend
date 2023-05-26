const pgPool = require('../database/db');

const queryInfoForProduct = (table, productid) => ({
  text: `SELECT * FROM ${table} WHERE product_id = $1`,
  values: [productid],
});

module.exports.product = {
  getAll: (req, res) => {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;

    pgPool.query(
      `SELECT *
      FROM product
      WHERE (product_id >= $1 AND product_id <= $2)`,
      [count * (page - 1) + 1, count * page],
    )
      .then((result) => {
        res.status(200).send(result.rows);
      })
      .catch(() => res.status(500).send('Bad query'));
  },

  getProduct: (req, res) => {
    const productId = req.query.product_id;

    const productInfo = {
      text: 'SELECT * FROM product WHERE product_id = $1',
      values: [productId],
    };

    const featureInfo = {
      text: 'SELECT * FROM feature WHERE product_id = $1',
      values: [productId],
    };

    Promise.all([
      pgPool.query(productInfo),
      pgPool.query(featureInfo),
    ])
      .then((result) => {
        console.log(result[1].rows);
        const productRes = result[0].rows[0];
        productRes.features = result[1].rows || {};
        res.status(200).send(productRes);
      })
      .catch((error) => { res.status(500).send(error.message); });
  },

  getStyles: (req, res) => {
    const productId = req.query.product_id;

    Promise.all([
      pgPool.query(queryInfoForProduct('product', productId)),
      pgPool.query(queryInfoForProduct('style', productId)),
      pgPool.query(queryInfoForProduct('photo', productId)),
      pgPool.query(queryInfoForProduct('sku', productId)),
    ])
      .then((result) => {
        const product = result[0].rows;
        const style = result[1].rows;
        const photo = result[2].rows;
        const sku = result[3].rows;
        res.status(200).send([product, style, photo, sku]);
      })
      .catch((error) => { res.status(500).send(error.message); });
  },

  getRelated: (req, res) => {
    const productId = req.query.product_id;

    pgPool.query('SELECT * FROM related WHERE (product_id1= $1 OR product_id2=$1)', [productId])
      .then((result) => {
        console.log(result.rows);
        res.status(200).send(result.rows);
      })
      .catch((error) => { res.status(500).send(error.message); });
  },
};
