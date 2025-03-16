const {body, validationResult} = require('express-validator');
const User = require('../models/user');
const logger = require('../config/logger');
const sequelize = require('../config/database');
// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'balance'],
    });

    if (!users.length) {
      return res.status(404).json({message: 'No users found.'});
    }

    return res.status(200).json({users});
  } catch (error) {
    logger.error('Error fetching users:', error);
    return res.status(500).json({message: 'Internal Server Error'});
  }
};

// Get User By ID
const getUserById = async (req, res) => {
  const {userId} = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    return res.status(200).json({user});
  } catch (error) {
    logger.error('Error fetching user:', error);
    return res.status(500).json({message: 'Internal Server Error'});
  }
};

// Update User Balance

const updateBalance = [
  body('userId').isUUID().withMessage('Invalid user ID'),
  body('amount')
    .isFloat({min: -99999999})
    .withMessage('Amount must be a valid number')
    .notEmpty()
    .withMessage('Amount cannot be empty'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {userId, amount} = req.body;

    const transaction = await sequelize.transaction();

    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        return res.status(400).json({message: 'Amount must be a valid number'});
      }

      const user = await User.findOne({
        where: {id: userId},
        lock: true,
        transaction,
      });

      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }

      const currentBalance = parseFloat(user.balance);
      if (currentBalance + parsedAmount < 0) {
        return res.status(400).json({message: 'Insufficient funds'});
      }

      user.balance = currentBalance + parsedAmount;
      await user.save({transaction});

      await transaction.commit();

      return res.status(200).json({
        message: 'Balance updated successfully.',
        balance: user.balance,
      });
    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating balance:', error);
      return res.status(500).json({message: 'Internal Server Error'});
    }
  },
];

// Delete User
const deleteUser = async (req, res) => {
  const {userId} = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    await user.destroy();

    return res.status(200).json({message: 'User deleted successfully'});
  } catch (error) {
    logger.error('Error deleting user:', error);
    return res.status(500).json({message: 'Internal Server Error'});
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateBalance,
  deleteUser,
};
