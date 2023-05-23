const axios = require('axios');

exports.questions = {
  getAll: (req, res) => {
    console.log('GET ALL REQ QUERY PARAMS IS ', req.query);
    // getting with the params: product_id, page: 1 and count: 6
    // page has potential to increase
    // send back get request in the form of results (results.data.results, an arr)
  },
  addQuestion: (req, res) => {
    console.log('POST REQ FOR QUESTION ', req.body)
    //posting coming in with {...question, product_id}
    // productId, body, name, email
  },
  markAsHelpful: (req, res) => {
    console.log('PUT REQUEST FOR HELPFUL Qs ', req.body);
  }
  report: (req, res) => {
    console.log('PUT REQUEST FOR REPORT Qs', req.body);
  }
}