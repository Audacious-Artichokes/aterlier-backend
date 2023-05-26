const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/questions-answers');

const QnASchema = mongoose.Schema({
  products: [
    {
      questions: [
        {
          body: String,
          date_written: Date,
          asker_name: String,
          asker_email: String,
          reported: Boolean,
          helpful: Number,
          answers: [
            {
              body: String,
              date_written: Date,
              answerer_name: String,
              answerer_email: String,
              reported: Boolean,
              helpful: Number,
              photos: [
                {
                  url: String,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

const QnA = mongoose.model('QnA', QnASchema);

module.exports.QnA = QnA;
