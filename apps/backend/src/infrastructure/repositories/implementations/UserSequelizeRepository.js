const { DataTypes, Op } = require('sequelize');
const sequelize = require('../../database/sequelize');
const UserRepository = require('../../../domain/repositories/UserRepository');
const User = require('../../../domain/entities/User');

// Define the Sequelize Model internally or import from a models folder
const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: 'users'
});

class UserSequelizeRepository extends UserRepository {
  constructor() {
    super();
    // Sync for dev purposes (in prod use migrations)
    UserModel.sync({ alter: true }); 
  }

  toEntity(modelData) {
    if (!modelData) return null;
    // toJSON provides a clean object, but we explicitly map logic fields if necessary
    // pass the plain object to the User constructor
    const user = new User(modelData.toJSON());
    return user;
  }

  async create(userEntity) {
    const newUser = await UserModel.create({
      username: userEntity.username,
      email: userEntity.email,
      password: userEntity.password,
      role: userEntity.role,
      isVerified: userEntity.isVerified,
      verificationToken: userEntity.verificationToken
    });
    return this.toEntity(newUser);
  }

  async update(userEntity) {
    const [numberOfAffectedRows] = await UserModel.update({
      username: userEntity.username,
      email: userEntity.email,
      password: userEntity.password,
      role: userEntity.role,
      isVerified: userEntity.isVerified,
      verificationToken: userEntity.verificationToken,
      passwordResetToken: userEntity.passwordResetToken,
      passwordResetExpires: userEntity.passwordResetExpires
    }, {
      where: { id: userEntity.id }
    });

    if (numberOfAffectedRows === 0) return null;
    return this.findById(userEntity.id);
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({ where: { email } });
    return this.toEntity(user);
  }

  async findById(id) {
    const user = await UserModel.findByPk(id);
    return this.toEntity(user);
  }

  async findByResetToken(hashedToken) {
    const user = await UserModel.findOne({
      where: {
        passwordResetToken: hashedToken,
        // Use new Date() for comparison with Sequelize DATE types
        passwordResetExpires: { [Op.gt]: new Date() } 
      }
    });
    return this.toEntity(user);
  }

  async findByVerificationToken(hashedToken) {
    const user = await UserModel.findOne({
      where: {
        verificationToken: hashedToken
      }
    });
    return this.toEntity(user);
  }
}

module.exports = UserSequelizeRepository;