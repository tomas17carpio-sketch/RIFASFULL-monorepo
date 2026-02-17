const logger = require('../../../shared/utils/logger');

class MockEmailAdapter {
  async sendPasswordReset(email, resetUrl) {
    // In a real implementation, use Nodemailer, SendGrid, AWS SES, etc.
    logger.info(`[EMAIL SERVICE MOCK] To: ${email}`);
    logger.info(`[EMAIL SERVICE MOCK] Subject: Password Reset Request`);
    logger.info(`[EMAIL SERVICE MOCK] Body: You requested a password reset. Click here to reset your password: ${resetUrl}`);
    return true;
  }

  async sendVerificationEmail(email, verificationUrl) {
    logger.info(`[EMAIL SERVICE MOCK] To: ${email}`);
    logger.info(`[EMAIL SERVICE MOCK] Subject: Confirm your Email`);
    logger.info(`[EMAIL SERVICE MOCK] Body: Welcome! Please verify your email by clicking here: ${verificationUrl}`);
    return true;
  }
}

module.exports = MockEmailAdapter;