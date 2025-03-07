    const {DataTypes} = require('sequelize');
    const sequelize = require('../config/database');
    const {hashPassword} = require('../utils/passwordUtils');
    const {isEmail} = require('validator');
    const {v4: uuidv4} = require('uuid');

    const User = sequelize.define(
      'User',
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: uuidv4,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        balance: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 10000.0,
          validate: {
            min: 0,
          },
        },
        role: {
          type: DataTypes.ENUM('user', 'admin'),
          allowNull: false,
          defaultValue: 'user',
        },
      },
      {
        sequelize,
        modelName: 'User',
        timestamps: true,
        paranoid: true,
      }
    );

    User.beforeCreate(async (user) => {
      if (!isEmail(user.email)) {
        throw new Error('Invalid email format');
      }

      if (!user.password || user.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      user.email = user.email.toLowerCase();

      if (user.balance < 0) {
        throw new Error('Balance cannot be negative');
      }

      const hashedPassword = await hashPassword(user.password);
      user.password = hashedPassword;
    });

    User.beforeUpdate(async (user) => {
      if (user.email) {
        if (!isEmail(user.email)) {
          throw new Error('Invalid email format');
        }
        user.email = user.email.toLowerCase();
      }

      if (user.password && user.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      if (user.balance < 0) {
        throw new Error('Balance cannot be negative');
      }

      if (user.password) {
        const hashedPassword = await hashPassword(user.password);
        user.password = hashedPassword;
      }
    });

    module.exports = User;
