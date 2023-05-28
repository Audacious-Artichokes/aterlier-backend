DROP DATABASE IF EXISTS QnA;

CREATE DATABASE QnA;

DROP TABLE IF EXISTS answerPhotos;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;


CREATE TABLE questions (
  id serial PRIMARY KEY,
  product_id INT,
  body VARCHAR(1000),
  date_written VARCHAR(255),
  asker_name VARCHAR(255),
  asker_email VARCHAR(255),
  reported BOOLEAN,
  helpful INT
);

COPY questions FROM '/Users/rachel/Desktop/HackReactor/SDC2/server/csv-files/questOutput.csv'
  DELIMITER '~';

CREATE TABLE answers (
  id serial PRIMARY KEY,
  question_id INT,
  body VARCHAR(1000),
  date_written VARCHAR(255),
  answerer_name VARCHAR(255),
  answerer_email VARCHAR(255),
  reported BOOLEAN,
  helpful INT,
  CONSTRAINT fk_question
    FOREIGN KEY (question_id)
      REFERENCES questions(id)
      ON DELETE SET NULL
);

COPY answers FROM '/Users/rachel/Desktop/HackReactor/SDC2/server/csv-files/answerOutput.csv'
  DELIMITER '~';

CREATE TABLE answerPhotos (
  id serial PRIMARY KEY,
  answer_id INT,
  url TEXT,
  FOREIGN KEY (answer_id) REFERENCES answers(id)
);

COPY answerPhotos FROM '/Users/rachel/Desktop/HackReactor/SDC2/server/csv-files/answerPhotoOutput.csv'
  DELIMITER '~';