'use strict';

// ROUTES FOR ME
// ===============================

var express = require('express'),
  router = express.Router();

// Routes /me
router.route('/')

.get((req, res) => res.send(req.decoded));

module.exports = router;