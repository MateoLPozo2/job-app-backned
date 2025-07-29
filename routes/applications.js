// routes/aplications.js
const express = require('express');
const router = express.Router();
const { getAllApplications, createApplication } = require('../controllers/applicationController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Application = require('../models/Application');

router.get('/', protect, getAllApplications);
router.post('/', protect, createApplication); 

router.post('/:id/upload', protect, upload.single('file'), async (req, res) => {
  // req.file will contain file info
  // req.params.id is application ID
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    // Save file path in Application
    app.resume = req.file.filename; // or req.file.path if you prefer
    await app.save();

    res.status(200).json({ message: 'File uploaded!', file: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;