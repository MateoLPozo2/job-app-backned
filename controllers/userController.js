// controllers/userController.js
const User = require('../models/User');

exports.getCurrentUser = (req, res) => {
  res.status(200).json(req.user);
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email createdAt'); // exclude password
    res.json(users);
  } catch (err) {
    console.error('[listUsers] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};