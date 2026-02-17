// This class acts as an Interface
class UserRepository {
  async create(userEntity) {
    throw new Error('Method not implemented');
  }

  async update(userEntity) {
    throw new Error('Method not implemented');
  }

  async findByEmail(email) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByResetToken(hashedToken) {
    throw new Error('Method not implemented');
  }

  async findByVerificationToken(hashedToken) {
    throw new Error('Method not implemented');
  }
}

module.exports = UserRepository;