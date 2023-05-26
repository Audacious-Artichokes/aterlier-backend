const axios = require('axios');

module.exports.products = {
  getAll: (req, res) => {
    axios({
      url: 'products',
      method: 'GET',
    })
      .then((result) => { res.status(200).send(result.data); })
      .catch((error) => { res.status(500).send(error.message); });
  },
};
