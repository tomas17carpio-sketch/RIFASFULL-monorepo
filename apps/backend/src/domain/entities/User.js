class User {
  constructor({ 
    id, 
    username, 
    email, 
    password, 
    role = 'user', 
    isVerified = false, 
    verificationToken = null,
    passwordResetToken = null,
    passwordResetExpires = null,
    createdAt, 
    updatedAt 
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password; // Hashed password
    this.role = role;
    this.isVerified = isVerified;
    this.verificationToken = verificationToken;
    this.passwordResetToken = passwordResetToken;
    this.passwordResetExpires = passwordResetExpires;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  // Domain logic example: Validate data before creation logic if needed
  isValid() {
    if (!this.email || !this.username) {
      return false;
    }
    return true;
  }
}

module.exports = User;