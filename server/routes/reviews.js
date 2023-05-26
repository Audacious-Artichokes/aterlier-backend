const review = require('../controllers/reviews');

module.exports = (app) => {
  app.get('/reviews', review.getReviews);
};
