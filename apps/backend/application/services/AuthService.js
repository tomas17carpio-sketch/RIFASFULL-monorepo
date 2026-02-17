const User = require('../../domain/entities/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../../config/config');
const CustomError = require('../../shared/errors/CustomError');
const logger = require('../../shared/utils/logger');

class AuthService {
  constructor(userRepository, emailAdapter) {
    this.userRepository = userRepository;
    this.emailAdapter = emailAdapter;
  }

  async register(authDto) {
    const { username, email, password } = authDto;

    logger.info(`[AuthService] Registration attempt initiated for email: ${email}`);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      logger.warn(`[AuthService] Registration failed: User already exists with email ${email}`);
      throw new CustomError('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken: hashedVerificationToken
    });

    const createdUser = await this.userRepository.create(newUser);
    logger.info(`[AuthService] User created successfully with ID: ${createdUser.id}`);

    // Send Email
    const verificationUrl = `${config.app.env === 'development' ? 'http://localhost:3000' : ''}/api/auth/verify-email/${verificationToken}`;
    
    try {
      await this.emailAdapter.sendVerificationEmail(email, verificationUrl);
      logger.info(`[AuthService] Verification email sent to: ${email}`);
    } catch (error) {
      logger.error(`[AuthService] Failed to send verification email to ${email}: ${error.message}`);
      throw new CustomError('User created, but failed to send verification email.', 500);
    }

    return { message: 'Registration successful! Please check your email to verify your account.' };
  }

  async verifyEmail(token) {
    logger.info('[AuthService] Email verification attempt.');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userRepository.findByVerificationToken(hashedToken);
    if (!user) {
      logger.warn('[AuthService] Email verification failed: Invalid or expired token.');
      throw new CustomError('Token is invalid or has expired', 400);
    }

    user.isVerified = true;
    user.verificationToken = null;
    
    const updatedUser = await this.userRepository.update(user);
    logger.info(`[AuthService] Email verified successfully for user ID: ${updatedUser.id}`);
    
    return this.generateToken(updatedUser);
  }

  async login(authDto) {
    const { email, password } = authDto;

    logger.info(`[AuthService] Login attempt for email: ${email}`);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      logger.warn(`[AuthService] Login failed: User not found for email ${email}`);
      throw new CustomError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`[AuthService] Login failed: Invalid password for email ${email}`);
      throw new CustomError('Invalid credentials', 401);
    }

    if (!user.isVerified) {
      logger.warn(`[AuthService] Login failed: Unverified email for user ID ${user.id}`);
      throw new CustomError('Please verify your email before logging in.', 401);
    }

    logger.info(`[AuthService] User logged in successfully: ${user.id}`);
    return this.generateToken(user);
  }

  async forgotPassword(email) {
    logger.info(`[AuthService] Password reset requested for email: ${email}`);
    
    // 1. Get user based on email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      logger.warn(`[AuthService] Password reset failed: Email not found ${email}`);
      throw new CustomError('There is no user with that email address.', 404);
    }

    // 2. Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 3. Hash token and set it to user fields
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Token expires in 10 minutes. Use explicit Date object for SQL compatibility.
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await this.userRepository.update(user);

    const resetUrl = `${config.app.env === 'development' ? 'http://localhost:3000' : ''}/api/auth/reset-password/${resetToken}`;
    
    try {
      await this.emailAdapter.sendPasswordReset(user.email, resetUrl);
      logger.info(`[AuthService] Password reset email sent to: ${email}`);
      return { message: 'Token sent to email!' };
    } catch (err) {
      logger.error(`[AuthService] Failed to send password reset email to ${email}: ${err.message}`);
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await this.userRepository.update(user);
      throw new CustomError('There was an error sending the email. Try again later.', 500);
    }
  }

  async resetPassword(token, newPassword) {
    logger.info('[AuthService] Password reset confirmation attempt.');

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await this.userRepository.findByResetToken(hashedToken);

    if (!user) {
      logger.warn('[AuthService] Password reset failed: Invalid or expired token.');
      throw new CustomError('Token is invalid or has expired', 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    const updatedUser = await this.userRepository.update(user);
    logger.info(`[AuthService] Password reset successful for user ID: ${updatedUser.id}`);

    return this.generateToken(updatedUser);
  }

  generateToken(user) {
    const payload = {
      id: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = AuthService;