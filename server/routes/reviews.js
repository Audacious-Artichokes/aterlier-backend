const product = require('../controllers/reviews');
require('dotenv').config();

module.exports = (app) => {
  app.get('/reviews', reviews.getAll);
};
