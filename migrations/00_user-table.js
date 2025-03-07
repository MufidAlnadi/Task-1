const {DataTypes} = require('sequelize');
const sequelize = require('../src/config/database'); // Adjust the path to where your Sequelize instance is
const {v4: uuidv4} = require('uuid'); // Import uuidv4 to generate UUIDs

module.exports = {
  up: async () => {
    const queryInterface = sequelize.getQueryInterface(); // Get the QueryInterface
    await queryInterface.createTable('Users', {
      id: {
        type: DataTypes.UUID, // Change to UUID
        allowNull: false,
        primaryKey: true,
        defaultValue: uuidv4, // Automatically generate UUID
      },
      name: {
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
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 10000.0,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE, // For soft deletes (paranoid model)
      },
    });
  },

  down: async () => {
    const queryInterface = sequelize.getQueryInterface(); // Get the QueryInterface again
    await queryInterface.dropTable('Users');
  },
};
