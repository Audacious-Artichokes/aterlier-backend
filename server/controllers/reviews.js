// const axios = require('axios');
const Review = require('../db/mongo');

const reviewdata = {
  rating: 4,
  summary: 'Great product',
  // ...
};

Review.create(reviewdata)
  .then((savedReview) => {
    console.log('Review saved');
  })
  .catch((error) => {
    console.error('Error saving review:', error);
  });

// module.exports.reviews = {
//   getAll: (req, res) => {
//     axios({
//       url: 'review',
//       method: 'GET',
//     })
//       .then((result) => { res.status(200).send(result.data); })
//       .catch((error) => { res.status(500).send(error.message); });
//   }
// };
