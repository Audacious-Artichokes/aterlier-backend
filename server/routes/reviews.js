const product = require('../controllers/reviews');

module.exports = (app) => {
  app.get('/reviews', reviews.getAll);
};
