// routes/users.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getCurrentUser, listUsers } = require('../controllers/userController');
const { register } = require('../controllers/authController');

// get my profile
router.get('/me', protect, getCurrentUser);

// list users (protect it; or add an isAdmin check later)
router.get('/', protect, listUsers);

// OPTIONAL alias for register under /api/users/register
router.post('/register', register);

module.exports = router;