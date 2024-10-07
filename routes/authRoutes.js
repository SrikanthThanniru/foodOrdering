const express = require('express');
const router = express.Router();
const { register, login, updateProfile, getUserById } = require('../controllers/authControllers');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', register);
  
// User login
router.post('/login', login);

// Get user by ID
router.get('/users/:id', auth, getUserById);

// Update user profile (JWT required)
router.put('/profile', auth, updateProfile);

module.exports = router;
