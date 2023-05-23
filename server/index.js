require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const questions = require('./controllers/questions');
const answers = require('./controllers/answers');

const app = express();

// Middleware - functions called between processing the request and sending the response in application.
app.use(cors());
app.use(morgan('dev'));

/* For POST and PUT requests, any time you're sending data
these will serve up a json object in the req.body
urlencoded will recognize incoming req object as strings or arrays
express.json will recognize incoming req obj as a json obj
alternative to urlencoded and express.json is body-parser:
app.use(bodyParser.json()) and app.use(bodyParser.urlencoded({extended: true})) */
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
