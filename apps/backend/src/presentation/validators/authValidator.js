const { body, param, validationResult } = require('express-validator');
const CustomError = require('../../shared/errors/CustomError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map(err => err.msg).join(', ');
    return next(new CustomError(msg, 400));
  }
  next();
};

exports.registerValidator = [
  body('username').notEmpty().withMessage('Username is required').trim().escape(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars long'),
  validate
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

exports.forgotPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  validate
];

exports.resetPasswordValidator = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars long'),
  // Token is usually validated via route param check or inside service, 
  // but we can ensure it's not empty if passed in body. Here it is in URL.
  validate
];

exports.verifyEmailValidator = [
  param('token').notEmpty().withMessage('Token is required'),
  validate
];