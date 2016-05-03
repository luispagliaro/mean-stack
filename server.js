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
  // CALLS ROUTES --------------------
  usersRouter = require('./app/routes/users'),
  postsRouter = require('./app/routes/posts'),
  authRouter = require('./app/routes/authenticate'),
  meRouter = require('./app/routes/me'),
  apiRouter = express.Router(),
  // ADDITIONAL --------------------
  tokenVerification = require('./app/utils/tokenVerification'),
  port = process.env.PORT || 8080;

// APP CONFIGURATION ---------------------

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/database');

// Uses body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
22 Authorization');
  next();
});

// Logs all requests to the console
app.use(morgan('dev'));

// ROUTES
// =============================

// Sends index.html file to the user for the home page
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

// ROUTES FOR THE API
// =============================

// REGISTER OUR ROUTES -------------------------------

// Route for authenticating users
apiRouter.use('/authenticate', authRouter);

// API endpoint to get user information
apiRouter.use('/me', usersRouter);

// Middleware to verify token
apiRouter.use((req, res, next) => TokenVerification(req, res, next));

// Tests route to make sure everything is working
// Accessed at GET http://localhost:8080/api
apiRouter.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API!'
  });
});

// On routes that end in /users
apiRouter.use('/users', usersRouter);

// All routes will be prefixed with /api
app.use('/api', apiRouter);

// START THE SERVER
// ===============================
app.listen(port);
console.log('Magic happens on port ' + port);