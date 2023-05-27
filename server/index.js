require('dotenv').config();
// const path = require('path');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const routes = require('./routes/index');

const app = express();

// Middleware

app.use(cors());
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up routes
routes(app);

module.exports = app;
