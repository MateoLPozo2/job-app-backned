// routes/users.js
router.get('/me', authMiddleware, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});