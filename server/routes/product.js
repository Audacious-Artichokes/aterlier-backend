const { product } = require('../controllers/product');

module.exports = (app) => {
  app.get('/products', product.getAll);
  app.get('/products/:product_id', product.getProduct);
  app.get('/products/:product_id/styles', product.getStyles);
  app.get('/products/:product_id/related', product.getRelated);
};
