const CustomError = require('../../../shared/errors/CustomError');

/**
 * Middleware to restrict access to specific user roles.
 * Must be used after authentication middleware (which sets req.user).
 * @param {...string} roles - List of allowed roles (e.g., 'admin', 'user').
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Ensure the user is authenticated first
    if (!req.user) {
      return next(new CustomError('User identification not found. Please log in.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new CustomError('You do not have permission to perform this action', 403));
    }

    next();
  };
};