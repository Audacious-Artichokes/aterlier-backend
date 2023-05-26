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
        const resObj = result.rows.map((row) => {
          const {
            name, slogan, description, category,
          } = row;
          return {
            id: row.product_id,
            name,
            slogan,
            description,
            category,
            default_price: row.default_price,
          };
        });
        res.status(200).send(resObj);
      })
      .catch(() => res.status(500).send('Bad query'));
  },

  getProduct: (req, res) => {
    const productId = req.query.product_id;

    Promise.all([
      pgPool.query(queryInfoForProduct('product', productId)),
      pgPool.query(queryInfoForProduct('feature', productId)),
    ])
      .then((result) => {
        const resObj = result[0].rows[0];
        resObj.features = result[1].rows.map((row) => (
          { feature: row.feature, value: row.value })) || {};
        res.status(200).send(resObj);
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
        const resObj = { product_id: productId };
        const styles = result[1].rows;
        const photos = result[2].rows;
        const skus = result[3].rows;

        const skuForStyle = (skuArr, styleId) => {
          const styleSKU = {};
          skuArr.forEach((sku) => {
            if (sku.style_id === styleId) {
              styleSKU[sku.sku_id] = { quantity: sku.qty, size: sku.size };
            }
          });
          return styleSKU;
        };

        const photoForStyle = (photoArr, styleId) => {
          const stylePhoto = [];
          photoArr.forEach((photo) => {
            if (photo.style_id === styleId) {
              stylePhoto.push({ thumbnail_url: photo.thumbnail_url, url: photo.url });
            }
          });
        };

        resObj.results = styles.map((style) => ({
          style_id: style.style_id,
          name: style.name,
          original_price: style.original_price,
          sale_price: style.sale_price,
          'default?': style.default_style,
          photos: photoForStyle(photos, style.style_id),
          skus: skuForStyle(skus, style.style_id),
        }));
        res.status(200).send(resObj);
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
