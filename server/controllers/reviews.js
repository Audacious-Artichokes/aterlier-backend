/* eslint-disable camelcase */
/* eslint-disable radix */
const reviewPool = require('../db/postgres.js');

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
      [count, offset, productNum],
    )
      .then((results) => {
        const resultArr = [];
        const promises = results.rows.map((rev) => {
          const revObj = {
            review_id: rev.id,
            rating: rev.rating,
            summary: rev.summary,
            recommend: rev.recommend,
            response: rev.response === 'null' ? null : rev.recommend,
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
            [rev.id, count, offset],
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

          res.status(201).send(data);
        }).catch((err) => {
          console.error(err);
          res.status(500).send(err);
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  },
  getMeta: (req, res) => {
    // eslint-disable-next-line camelcase
    const { product_id } = req.query;
    const ratingCounts = {};
    const recommended = {};
    const charholder = {};

    const fetchData = async () => {
      try {
        const ratingQuery = reviewPool.query(
          `SELECT rating, COUNT(*) AS count
          FROM revs
          WHERE product_id = $1
          GROUP BY rating`,
          [product_id],
        );

        const recommendedQuery = reviewPool.query(
          `SELECT recommend, COUNT(*) AS count
          FROM revs
          WHERE product_id = $1
          GROUP BY recommend`,
          [product_id],
        );

        const characteristicsQuery = reviewPool.query(
          `SELECT
            c.characteristic_id AS id,
            ci.name AS characteristic_name,
            AVG(c.value) AS average_value
          FROM
            charsinfo ci
          JOIN
            chars c ON ci.id = c.characteristic_id
          WHERE
            ci.product_id = $1
          GROUP BY
            c.characteristic_id, ci.name`,
          [product_id],
        );

        const [ratingResult, recommendedResult, characteristicsResult] = await Promise.all([
          ratingQuery,
          recommendedQuery,
          characteristicsQuery,
        ]);

        ratingResult.rows.forEach((row) => {
          const { rating } = row;
          const count = parseInt(row.count);
          ratingCounts[rating] = count;
        });

        // console.log(ratingCounts);

        recommendedResult.rows.forEach((row, index) => {
          const count = parseInt(row.count);
          recommended[`${index}`] = count;
        });

        // console.log(recommended);

        characteristicsResult.rows.forEach((char) => {
          charholder[char.characteristic_name] = {
            id: char.id,
            value: Number(char.average_value).toFixed(4).toString(),
          };
        });

        // console.log('characteristics', charholder);

        // Continue with the rest of your code that depends on the fetched data
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };
    // Call the async function
    fetchData()
      .then(() => {
        res.status(201).send({
          product_id,
          ratings: ratingCounts,
          recommended,
          characteristics: charholder,
        });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  },
  // postRev: (req, res) => {
  //   console.log(req);
  // },
};
