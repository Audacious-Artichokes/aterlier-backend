const reviewPool = require('../db/postgres');

module.exports.review = {
  getReviews: (req, res) => {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const productNum = Number(req.query.product_id);
    const offset = (page - 1) * count;

    reviewPool.query(
      `SELECT *
      FROM revs
      WHERE product_id = $3
      ORDER BY date
      LIMIT $1 OFFSET $2`,
      [count, offset, productNum]
    )
      .then((results) => {
        const resultArr = [];
        const promises = results.rows.map((rev) => {
          const revObj = {
            review_id: rev.id,
            rating: rev.rating,
            summary: rev.summary,
            recommend: rev.recommend === 'null' ? null : rev.recommend,
            response: rev.response,
            body: rev.body,
            date: new Date(rev.date * 1).toISOString(),
            reviewer_name: rev.reviewer_name,
            helpfulness: rev.helpfulness,
            photos: [],
          };

          return reviewPool.query(
            `SELECT *
            FROM revphotos
            WHERE review_id = $1
            LIMIT $2 OFFSET $3`,
            [rev.id, count, offset]
          ).then((photosResult) => {
            const photos = photosResult.rows;
            revObj.photos = photos;
            resultArr.push(revObj);
          });
        });

        Promise.all(promises).then(() => {
          const data = {
            product: `${productNum}`,
            page: `${page}`,
            count: `${count}`,
            results: resultArr,
          };

          res.status(200).send(data);
        }).catch((err) => {
          console.error(err);
          res.status(500).send('Bad Query');
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Bad Query');
      });
  },
};
