const jwt = require('jsonwebtoken');
const config = require('../../../config');
const CustomError = require('../../../shared/errors/CustomError');

exports.protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new CustomError('You are not logged in. Please log in to get access.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    // Attach user payload to request
    req.user = decoded; 
    next();
  } catch (error) {
    return next(new CustomError('Invalid Token', 401));
  }
};