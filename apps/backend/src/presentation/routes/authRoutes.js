const express = require('express');
const router = express.Router();
const { 
  registerValidator, 
  loginValidator, 
  forgotPasswordValidator, 
  resetPasswordValidator,
  verifyEmailValidator
} = require('../validators/authValidator');

// Dependency Injection occurs in the main app file or a container, 
// but for simplicity in Express routing, we often instantiate here or pass instances.
// Here we assume instances are passed or created.

module.exports = (authController) => {
  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: User authentication and management
   */

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 6
   *     responses:
   *       201:
   *         description: User registered successfully. Email verification required.
   *       400:
   *         description: Validation error or User already exists.
   */
  router.post('/register', registerValidator, authController.register);

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login a user
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful, returns JWT token.
   *       401:
   *         description: Invalid credentials or unverified email.
   */
  router.post('/login', loginValidator, authController.login);

  /**
   * @swagger
   * /auth/verify-email/{token}:
   *   get:
   *     summary: Verify user email
   *     tags: [Auth]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: token
   *         schema:
   *           type: string
   *         required: true
   *         description: Verification token sent via email
   *     responses:
   *       200:
   *         description: Email verified successfully.
   *       400:
   *         description: Invalid or expired token.
   */
  router.get('/verify-email/:token', verifyEmailValidator, authController.verifyEmail);

  /**
   * @swagger
   * /auth/forgot-password:
   *   post:
   *     summary: Request password reset
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       200:
   *         description: Reset token sent to email.
   *       404:
   *         description: User not found.
   */
  router.post('/forgot-password', forgotPasswordValidator, authController.forgotPassword);

  /**
   * @swagger
   * /auth/reset-password/{token}:
   *   patch:
   *     summary: Reset password
   *     tags: [Auth]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: token
   *         schema:
   *           type: string
   *         required: true
   *         description: Reset token received via email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - password
   *             properties:
   *               password:
   *                 type: string
   *                 minLength: 6
   *     responses:
   *       200:
   *         description: Password reset successfully.
   *       400:
   *         description: Invalid or expired token.
   */
  router.patch('/reset-password/:token', resetPasswordValidator, authController.resetPassword);
  return router;
};