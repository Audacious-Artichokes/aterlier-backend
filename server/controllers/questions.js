const pool = require('../db_Postgres');

exports.questions = {
  getAll: (req, res) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const product = req.query.product_id;
    const offset = (page - 1) * count;

    const quests = [];
    pool.query(
      `SELECT *
      FROM questions
      WHERE product_id = $1
      ORDER BY question_id
      LIMIT $2 OFFSET $3`,
      [product, count, offset],
    )
      .then((results) => {
        console.log('RESULTS FROM QUERY ', results);
      });

    // input: product_id, page || 1, count || 5 as parameters
    // output : { product_id: #, results: [{THE WHOLE THING}]}
    // send back get request in the form of results (results.data.results, an arr)
  },
  addQuestion: (req, res) => {
    console.log('POST REQ FOR QUESTION ', req.body)
    //posting coming in with {...question, product_id}
    // productId, body, name, email
  },
  markAsHelpful: (req, res) => {
    console.log('PUT REQUEST FOR HELPFUL Qs ', req.body);
  },
  report: (req, res) => {
    console.log('PUT REQUEST FOR REPORT Qs', req.body);
  },
};
