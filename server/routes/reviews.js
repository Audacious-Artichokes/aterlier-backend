// eslint-disable-next-line import/extensions
const { review } = require('../controllers/reviews.js');

module.exports = (app) => {
  app.get('/reviews', review.getReviews);
  app.get('/reviews/meta', review.getMeta);
  // app.post('/reviews', review.postRev);
};
