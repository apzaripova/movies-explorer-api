const rateLimit = require('express-rate-limit');

exports.rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 100 requests per windowMs
});
