// routes/jobs.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const jobCtrl = require('../controllers/jobController');


console.log('[DEBUG routes/jobs] keys:', {
  protect: typeof protect,
  jobCtrl: Object.keys(jobCtrl || {})
});

router.get('/_ping', (req, res) => res.json({ ok: true, t: Date.now() }));

router.get('/',      jobCtrl.getAllJobs);              // public
router.get('/:id',   jobCtrl.getJobById);              // public
router.post('/',     protect, jobCtrl.createJob);      // auth
router.put('/:id',   protect, jobCtrl.updateJob);      // auth
router.delete('/:id',protect, jobCtrl.deleteJob);      // auth

module.exports = router;