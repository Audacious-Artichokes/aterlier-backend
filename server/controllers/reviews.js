const axios = require('axios');

module.exports.reviews = {
  getAll: (req, res) => {
    axios({
      url: 'review',
      method: 'GET',
    })
      .then((result) => { res.status(200).send(result.data); })
      .catch((error) => { res.status(500).send(error.message); });
  }
};
