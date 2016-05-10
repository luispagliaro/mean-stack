'use strict';

var usersRouter = require('./users'),
  postsRouter = require('./posts'),
  authRouter = require('./authenticate'),
  meRouter = require('./me'),
  tokenVerification = require('../utils/tokenVerification');

module.exports = (app, express) => {
  var apiRouter = express.Router();

  // ROUTES FOR THE API
  // =============================

  // Route for authenticating users
  apiRouter.use('/authenticate', authRouter);

  // Middleware to verify token
  apiRouter.use((req, res, next) => {
    tokenVerification(req, res, next)
  });

  // API endpoint to get user information
  apiRouter.use('/me', meRouter);

  // On routes that end in /users
  apiRouter.use('/users', usersRouter);

  return apiRouter;
};