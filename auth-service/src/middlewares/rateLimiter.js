const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3,
  standardHeaders: true, 
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Demasiados intentos fallidos. Intenta más tarde.'
  }
});
