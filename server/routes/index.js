const reviews = require('./reviews');
const qa = require('./qa');
const product = require('./product');

module.exports = (app) => {
  reviews(app);
  qa(app);
  product(app);
};
