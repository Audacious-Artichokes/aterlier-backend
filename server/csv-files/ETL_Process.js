/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const csv = require('csvtojson');
const json2csv = require('json2csv');
const { Transform, pipeline } = require('stream');

// EXTRACT data from csv files (held locally in project)

const questInputStream = fs.createReadStream('/Users/rachel/Desktop/HackReactor/SDC2/server/csv-files/questions.csv');
const answerInputStream = fs.createReadStream('/Users/rachel/Desktop/HackReactor/SDC2/server/csv-files/answers.csv');
const answerPhotoInputStream = fs.createReadStream('/Users/rachel/Desktop/HackReactor/SDC2/server/csv-files/answers_photos.csv');

const questOutputStream = fs.createWriteStream('/Users/rachel/Desktop/HackReactor/SDC2/server/csv-files/questOutput.csv');
const answerOutputStream = fs.createWriteStream('/Users/rachel/Desktop/HackReactor/SDC2/server/csv-files/answerOutput.csv');
const ansPhotoOutputStream = fs.createWriteStream('/Users/rachel/Desktop/HackReactor/SDC2/server/csv-files/answerPhotoOutput.csv');

const csvParser = csv();

// Transform data types for any given row received from read stream

function transformOne(chunk) {
  chunk.id = Number(chunk.id);
  if (chunk.product_id) {
    chunk.product_id = Number(chunk.product_id);
  }
  if (chunk.question_id) {
    chunk.question_id = Number(chunk.question_id);
  }
  if (chunk.answer_id) {
    chunk.answer_id = Number(chunk.answer_id);
  }
  if (chunk.helpful) {
    chunk.helpful = Number(chunk.helpful);
  }
  if (chunk.reported && chunk.reported === '0') {
    chunk.reported = false;
  } else if (chunk.reported && chunk.reported === '1') {
    chunk.reported = true;
  }
  if (chunk.date_written) {
    const jsDate = new Date(chunk.date_written * 1).toISOString();
    if (jsDate) {
      chunk.date_written = jsDate;
    } else {
      console.log('ERROR IN SETTING DATE FOR THIS CHUNK ', chunk);
    }
  }

  return chunk;
}

// As rows come in through csv pipe, invoke transform function

const conformedData = new Transform({
  transform(row, encoding, cb) {
    try {
      const rowObj = JSON.parse(row);
      const transformedRow = transformOne(rowObj);
      const parsedBack = `${json2csv.parse(transformedRow, { quote: '', header: false, delimiter: '~' })}\r\n`;
      cb(null, parsedBack);
    } catch (err) {
      cb(err);
    }
  },
});

// ETL Process: extract from local csv, transform, write onto output csv,
// then use COPY within Postgres to insert into db. Pipeline automatically drains after
// highWaterMark is reached

// Questions

pipeline(questInputStream, csvParser, conformedData, questOutputStream, (err) => {
  if (err) {
    console.log('Error occurred in the pipeline for Questions ', err);
  } else {
    console.log('SUCCESS! Pipeline for Questions Completed.');
  }
});

// Answers

pipeline(answerInputStream, csvParser, conformedData, answerOutputStream, (err) => {
  if (err) {
    console.log('Error occurred in pipeline for Answers , ', err);
  } else {
    console.log('SUCCESS! Pipeline for Answers Completed.');
  }
});

// Answer Photos

pipeline(answerPhotoInputStream, csvParser, conformedData, ansPhotoOutputStream, (err) => {
  if (err) {
    console.log('Error occurred in pipeline for Answer Photos ', err);
  } else {
    console.log('SUCCESS! Pipeline for Answer Photos Completed.');
  }
});
