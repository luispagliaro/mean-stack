// ROUTES FOR AUTHENTICATE
// ===============================

'use strict';

let express = require('express'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  config = require('../../config'),
  User = require('../models/user');

// Routing /authenticate
router.route('/')

  .post((req, res) => {
  // Finds the user
  // Selects the name username and password explicitly
  User.findOne({
    username: req.body.username
  }).select('name username password').exec((err, user) => {
    if (err) {
      throw err;
    }

    // No user with that username was found
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {
      // Checks if password matches
      let validPassword = user.comparePassword(req.body.password);

      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {
        // If user is found and password is right creates a token
        let token = jwt.sign({
          name: user.name,
          username: user.username
        }, config.secret, {
          expiresIn: 1440 * 60 // Expires in 24 hours
        });

        // Returns the information including token as JSON
        res.json({
          success: true,
          message: 'Token created',
          token: token
        });
      }
    }
  });
});

module.exports = router;