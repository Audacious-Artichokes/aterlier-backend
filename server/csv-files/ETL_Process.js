/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const csv = require('csvtojson');
const json2csv = require('json2csv');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const questPath = '/Users/rachel/Desktop/HackReactor/SDC/server/csv-files/questions.csv';
const answersPath = '/Users/rachel/Desktop/HackReactor/SDC/server/csv-files/sample.csv';
const answerPhotoPath = '/Users/rachel/Desktop/HackReactor/SDC/server/csv-files/answers_photos.csv';

// convert all 3 csv files for QnA into JSON to conform data types as needed, then write back over
// the same csv file stored locally. From schema, use Postgres COPY command to insert data.
// question date needs to change and reported 0 or 1 changed to bool
// csv().fromFile(questPath)
//   .then((jsonArr) => {
//     const dataConversion = jsonArr.map((row) => {
//       row.id = Number(row.id);
//       row.product_id = Number(row.product_id);
//       row.helpful = Number(row.helpful);
//       if (row.reported === '0') {
//         row.reported = false;
//       } else {
//         row.reported = true;
//       }
//       const jsDate = new Date(row.date_written * 1).toISOString();
//       // jsDate = new Date(jsDate * 1).toISOString();
//       row.date_written = jsDate;
//       return row;
//     });
//     return dataConversion;
//   })
//   .catch((err) => console.log('Error in converting data types for csv rewrite Qs', err))
//   .then((modifiedArr) => {
//     const conformedQuests = json2csv.parse(modifiedArr, { quote: '', header: false, delimiter: '~' });
//     fs.writeFileSync(questPath, conformedQuests);
//   })
//   .catch((err) => console.log('Error in writing over the csv file with conformed data Qs', err));

// // answers are almost identical to questions but its HUGE (over 6 mill lines)
// Memory heap errors, even when more memory allocated to VS code so let's look at alternatives
// need to drain the buffer as the data is coming in and node needs to wait until the drain before
// it continues to read.
const answerOutput = '/Users/rachel/Desktop/HackReactor/SDC/server/csv-files/answers_output.csv';
// const csvWriter = createCsvWriter({
//   path: answerOutput,
//   header: ['id', 'question_id', 'body', 'date_written', 'answerer_name', 'answerer_email', 'reported', 'helpful'].map((item) => ({ id: item, title: item })),
// });

// fs.createReadStream(answersPath)
//   .pipe(csv())
//   .on('data', (row) => {
//     row.id = Number(row.id);
//     row.question_id = Number(row.question_id);
//     row.helpful = Number(row.helpful);
//     if (row.reported === '0') {
//       row.reported = false;
//     } else {
//       row.reported = true;
//     }
//     const jsDate = new Date(row.date_written * 1).toISOString();
//     row.date_written = jsDate;
//     const conformedAnswers = new Parser({ quote: '', header: false, delimiter: '~' }).parse(row, { quote: '', header: false, delimiter: '~' });
//     // fs.writeFileSync(answerOutput, conformedAnswers);
//     const file = fs.createWriteStream(answerOutput);
//     file.write
//   })
csv().fromFile(answersPath)
  .then((jsonArr) => {
    const dataConversion = jsonArr.map((row) => {
      row.id = Number(row.id);
      row.question_id = Number(row.question_id);
      row.helpful = Number(row.helpful);
      if (row.reported === '0') {
        row.reported = false;
      } else {
        row.reported = true;
      }
      const jsDate = new Date(row.date_written * 1).toISOString();
      row.date_written = jsDate;
      return row;
    });
    return dataConversion;
  })
  .catch((err) => console.log('Error in converting data types for csv rewrite As', err))
  .then((modifiedArr) => {
    (async () => {
      const conformedAnswers = json2csv.parse(modifiedArr, { quote: '', header: false, delimiter: '~' });
      const file = fs.createWriteStream(answerOutput);
      for (let i = 0; i < modifiedArr.length; i++) {
        const overWatermark = file.write(conformedAnswers);

        if (!overWatermark) {
          await new Promise((resolve) => {
            writeStream.once('drain', resolve)
          });
        }
      }
    })();
  })
  .catch((err) => console.log('Error in writing over the csv file with conformed data As', err));

// answer photos need conversion of: id to number, reference to answer_id number, and url in str
// csv().fromFile(answerPhotoPath)
//   .then((jsonArr) => {
//     const dataConversion = jsonArr.map((row) => {
//       row.id = Number(row.id);
//       row.answer_id = Number(row.answer_id);
//       row.url = row.url.toString();
//       return row;
//     });
//     return dataConversion;
//   })
//   .catch((err) => console.log('Error in converting data types for csv rewrite AnsPhotos', err))
//   .then((modifiedArr) => {
//     const conformedAnswerPhotos = json2csv.parse(modifiedArr, { quote: '', header: false, delimiter: '~' });
//     fs.writeFileSync(answerPhotoPath, conformedAnswerPhotos);
//   })
//   .catch((err) => console.log('Error in writing over the csv file with conformed data As', err));
