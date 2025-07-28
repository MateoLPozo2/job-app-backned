// routes/jobs.js
const express = require('express');
const router = express.Router();
const { createJob, getAllJobs } = require('../controllers/jobController');

router.post('/', createJob);      // Create a new job
router.get('/', getAllJobs);      // Get all jobs

module.exports = router;