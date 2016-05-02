var tokenVerification,
  secret = 'meanstackapp',
  jwt = require('jsonwebtoken');

tokenVerification = function(req, res, next) {
  var token = req.body.token || req.param('token') || req.headers['x-access-token'];

  // Decodes token
  if (token) {
    // Verifies secret and checks exp
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        return res.status(403).send({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // If everything is good, saves to request for use in other routes
        req.decoded = decoded;

        next();
      }
    });
  } else {
    // If there is no token returns an HTTP response of 403 (access forbidden) and an error message
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
};

module.exports = tokenVerification;