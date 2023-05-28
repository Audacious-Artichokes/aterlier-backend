const pool = require('../db_Postgres');

exports.answers = {
  getAll: (req, res) => {
    const questionId = Number(req.params.question_id);
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const offset = (page - 1) * count;

    const fullResult = {
      question: questionId,
      page,
      count,
      results: [],
    };

    pool.query(
      `SELECT *
      FROM answers
      WHERE question_id = $1
      AND reported = false
      ORDER BY question_id
      LIMIT $2 OFFSET $3`,
      [questionId, count, offset],
    )
      .then((results) => {
        const promiseMap = results.rows.map((row) => (
          new Promise((resolve, reject) => {
            const rowObj = {
              answer_id: row.id,
              body: row.body.slice(1, row.body.length - 2),
              date: row.date_written.slice(1, row.date_written.length - 2),
              answerer_name: row.answerer_name.slice(1, row.answerer_name.length - 2),
              answerer_email: row.answerer_email.slice(1, row.answerer_email.length - 2),
              helpfulness: row.helpful,
            };
            pool.query(
              `SELECT *
              FROM answerPhotos
              WHERE answer_id = $1`,
              [row.id],
            )
              .then((answerPhotos) => {
                const photos = answerPhotos.rows.map((photo) => (
                  {
                    id: photo.id,
                    url: photo.url.slice(1, photo.url.length - 2),
                  }
                ));
                rowObj.photos = photos;
                resolve(rowObj);
              })
              .catch((err) => reject(err));
          })
        ));
        return promiseMap;
      })
      .then((promises) => {
        const responseObj = Promise.all(promises);
        return responseObj;
      })
      .then((ansAndPhotos) => {
        fullResult.results = fullResult.results.concat(ansAndPhotos);
        res.status(200).send(fullResult);
      })
      .catch((err) => res.status(500).send(`UNABLE TO QUERY: ${err}`));
  },
  addAnswer: (req, res) => {
    const questionId = req.query.question_id;
    const {
      body, name, email, photos,
    } = req.body;
    const timestamp = new Date(Date.now() * 1).toISOString();

    pool.query(
      `WITH ins1 AS (
        INSERT INTO answers
          (question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
        VALUES
          ($1, $2, $3, $4, $5, false, 0)`,
      [questionId, body, timestamp, name, email],
      'RETURNING id)',
      `WITH RECURSIVE ins2 AS (
        SELECT id as answer_id FROM ins1
        UNION ALL

      )`
    )
    .then((results) => {
      // need to cover the insert of answer photos
    })
    res.status(201).send('testing');
  },
  markAsHelpful: (req, res) => {

  },
  report: (req, res) => {

  },
};
