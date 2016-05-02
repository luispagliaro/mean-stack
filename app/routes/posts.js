var express = require('express'),
  router = express.Router();

// Middleware to use for all requests
router.use('/', function(req, res, next) {
  console.log(req.method, req.url);

  // Makes sure we go to the next routes and don't stop here
  next();
});

router.route('/')

.get(function(req, res) {
  res.send('I show all the posts!');
});

module.exports = router;