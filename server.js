'use strict';

// BASE SETUP
// ===============================

// CALLS THE PACKAGES --------------------

let express = require('express'),
  app = express(),
  adminRouter = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  path = require('path'),
  config = require('./config'),
  apiRouter = require('./server/routes/api')(app, express);

// APP CONFIGURATION ---------------------

// Connect to MongoDB database
mongoose.connect(config.database);

// Uses body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// Logs all requests to the console
app.use(morgan('dev'));

// Loads node_modules
app.use('/node_modules', express.static('node_modules'));
app.use(express.static(__dirname + '/client'));

// ROUTES
// =============================

// All routes will be prefixed with /api
app.use('/api', apiRouter);

// Sends index.html file to the user for the home page
app.get('*', (req, res) => res.sendFile(path.join(`${__dirname}/client/app/views/index.html`)));

// START THE SERVER
// ===============================
app.listen(config.port);
console.log('Node server running on port ' + config.port);