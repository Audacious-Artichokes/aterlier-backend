require('dotenv').config();
const express = require('express');

const { questions } = require('./controllers/questions');
const { answers } = require('./controllers/answers');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up routes
app.get('/qa/questions', questions.getAll);
app.get('/qa/questions/:question_id/answers', answers.getAll);

app.post('/qa/questions', questions.addQuestion);
app.post('/qa/questions/:question_id/answers', answers.addAnswer);

app.put('/qa/questions/:question_id/helpful', questions.markAsHelpful);
app.put('/qa/answers/:answer_id/helpful', answers.markAsHelpful);

app.put('/qa/questions/:question_id/report', questions.report);
app.put('/qa/answers/:answer_id/report', answers.report);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server available at http://localhost:${PORT}`);
});

module.exports = app;
