// ROUTES FOR USERS
// ===============================
'use strict';

// ROUTES FOR USERS
// ===============================

var express = require('express'),
  router = express.Router(),
  User = require('../models/user');

// route middleware to validate :user_id
router.param('user_id', (req, res, next, user_id) => {
  // do validation on id here
  // log something so we know its working
  console.log(`doing id validations on ${user_id}`);

  // once validation is done save the new item in the req
  req.user_id = user_id;
  // go to the next thing
  next();
});

// Routes /users
router.route('/')

// Creates a user (accessed at POST http://localhost:8080/api/users)
.post((req, res) => {
  // Creates a new instance of the User model
  var user = new User();

  // Sets the users information (comes from the request)
  user.name = req.body.name;
  user.username = req.body.username;
  user.password = req.body.password;

  // Saves the user and check for errors
  user.save((err) => {
    if (err) {
      if (err.code == 11000) {
        return res.json({
          success: false,
          message: 'A user with that username already exists. '
        });
      } else {
        return res.send(err);
      }
    }

    res.json({
      message: 'User created!'
    });
  });
})

// Gets all the users (accessed at GET http://localhost:8080/api/users)
.get((req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.send(err);
    }

    res.json(users);
  });
});

router.route('/:user_id')

// Gets the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
.get((req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      return res.send(err);
    }

    res.json(user);
  });
})

// Updates the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
.put((req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      return res.send(err);
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.username) {
      user.username = req.body.username;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    user.save((err) => {
      if (err) {
        return res.send(err);
      }

      res.json({
        message: 'User updated!'
      });
    });
  });
})

// Deletes the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
.delete((req, res) => {
  User.remove({
    _id: req.params.user_id
  }, (err, user) => {
    if (err) {
      return res.send(err);
    }

    res.json({
      message: 'User deleted'
    });
  });
});

module.exports = router;