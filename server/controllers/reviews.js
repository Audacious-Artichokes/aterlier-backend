const reviewPool = require('server/db/postgres.js');

module.exports.review = {
  getReviews: (req, res) => {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const productNum = Number(req.query.product_id);
    const offset = (page - 1) * count;

    reviewPool.query(
      // eslint-disable-next-line no-template-curly-in-string
      `SELECT *
      FROM reviews
      where product_id = ${productNum}
      LIMIT $1 OFFSET $2
      ORDER BY date`,
      [count, offset],
    )
      .then((results) => {
        res.status(200).send(results.rows);
      })
      .catch(() => {
        res.status(500).send('Bad Query');
      });
  },
};
