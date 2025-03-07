const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateBalance,
  deleteUser,
} = require('../controllers/userController');
const {authMiddleware, isAdmin} = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, isAdmin, getAllUsers);

router.get('/:userId', authMiddleware, getUserById);

  router.put('/update-balance', authMiddleware, isAdmin, updateBalance);

router.delete('/:userId', authMiddleware, isAdmin, deleteUser);

module.exports = router;
