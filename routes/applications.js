const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Application = require('../models/Application');
const appCtrl = require('../controllers/applicationController');

console.log('[DEBUG routes/applications] keys:', {
  protect: typeof protect,
  appCtrl: Object.keys(appCtrl || {})
});

router.get('/',      protect, appCtrl.getAllApplications);
router.get('/:id',   protect, appCtrl.getApplicationById);
router.post('/',     protect, appCtrl.createApplication);

router.post('/:id/upload', protect, upload.single('file'), async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    app.resume = req.file.filename;
    await app.save();
    res.status(200).json({ message: 'File uploaded!', file: req.file.filename });
  } catch (err) {
    console.error('[upload resume] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;