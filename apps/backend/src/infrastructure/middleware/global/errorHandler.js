const logger = require('../../../shared/utils/logger');
const CustomError = require('../../../shared/errors/CustomError');

// -- Error Type Handlers --

const handleSequelizeValidationError = (err) => {
  const message = err.errors.map(el => el.message).join('. ');
  return new CustomError(`Invalid input data: ${message}`, 400);
};

const handleSequelizeUniqueConstraintError = (err) => {
  // e.g., "email must be unique"
  const message = err.errors.map(el => el.message).join('. ');
  return new CustomError(`Duplicate field value: ${message}`, 400);
};

const handleJWTError = () =>
  new CustomError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new CustomError('Your token has expired! Please log in again.', 401);

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new CustomError(message, 400);
};

// -- Response Generators --

const sendErrorDev = (err, req, res) => {
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, req, res) => {
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    // Log operational errors as warnings to track them without alerting as critical
    logger.warn(`Operational Error: ${err.message} [Code: ${err.statusCode}] - ${req.originalUrl} - ${req.ip}`);
    
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // B) Programming or other unknown error: don't leak details
  // 1) Log error
  logger.error(`ERROR 💥: ${err.message}`, err);

  // 2) Send generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
};

// -- Main Middleware --

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    // Create a copy of the error to modify it without affecting the original in case of re-throw
    // Note: Error properties like 'name' or 'message' are not enumerable, so simple spread {...err} might miss them
    let error = Object.create(err);
    error.message = err.message;
    error.name = err.name;
    error.statusCode = err.statusCode;
    error.isOperational = err.isOperational;
    
    // Sequelize Errors
    if (error.name === 'SequelizeValidationError') error = handleSequelizeValidationError(err);
    if (error.name === 'SequelizeUniqueConstraintError') error = handleSequelizeUniqueConstraintError(err);
    
    // JWT Errors
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    // General Cast Errors (e.g. bad ID format if manually parsing)
    if (error.name === 'CastError') error = handleCastError(err);

    sendErrorProd(error, req, res);
  }
};

module.exports = errorHandler;