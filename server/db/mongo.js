const mongoose = require('mongoose');
require('dotenv').config();

// const PORT = process.env.PORT || 3500;
// console.log(process.env.DB_NAME);

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

const reviewSchema = new mongoose.Schema(
  {
    results: [{
      rating: Number,
      summary: String,
      response: String,
      body: String,
      date: Date,
      reviewer_name: String,
      helpfulness: Number,
      photos: [{
        url: String,
      },
        // ...
      ],
    },
      // ...
    ],
  },
);

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;
