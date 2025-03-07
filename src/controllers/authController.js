const {body, validationResult} = require('express-validator');
const User = require('../models/user'); // Ensure this is your correct model path
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const config = require('../config/config');
const {
  hashPassword,
  validatePassword,
  comparePassword,
} = require('../utils/passwordUtils');

// Login Controller
const login = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({min: 8})
    .withMessage('Password must be at least 8 characters'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try {
      const user = await User.findOne({where: {email}});
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }

      // const isPasswordValid = await comparePassword(password, user.password);
      // if (!isPasswordValid) {
      //   return res.status(401).json({message: 'Invalid password'});
      // }

      const token = jwt.sign(
        {id: user.id, email: user.email, role: user.role},
        config.jwt.secret,
        {expiresIn: config.jwt.expiresIn}
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
      });
    } catch (error) {
      logger.error('Error logging in:', error);
      return res.status(500).json({message: 'Internal Server Error'});
    }
  },
];

// Register Controller
const register = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({min: 8})
    .withMessage('Password must be at least 8 characters'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password} = req.body;

    try {
      if (!validatePassword(password)) {
        return res.status(400).json({
          message: 'Password does not meet the required criteria.',
        });
      }

      const existingUser = await User.findOne({where: {email}});
      if (existingUser) {
        return res
          .status(400)
          .json({message: 'User with this email already exists.'});
      }

      const hashedPassword = await hashPassword(password);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        message: 'User registered successfully.',
        user: {id: user.id, name: user.name, email: user.email},
      });
    } catch (error) {
      logger.error('Error registering user:', error);
      return res.status(500).json({message: 'Internal Server Error'});
    }
  },
];

module.exports = {login, register};
