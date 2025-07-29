// controllers/userController.js
exports.getCurrentUser = (req, res) => {
  res.status(200).json(req.user); // req.user is set by authMiddleware
};