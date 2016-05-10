'use strict';

// ROUTES FOR POSTS
// ===============================

var express = require('express'),
  router = express.Router();

// Routes /posts
router.route('/')

.get((req, res) => res.send('I show all the posts!'));

module.exports = router;