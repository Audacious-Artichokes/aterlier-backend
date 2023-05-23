const product = require('../controllers/product');

module.exports = (app) => {
  app.get('/products', product.getAll);
};
