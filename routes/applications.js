// routes/aplications.js
const express = require('express');
const router = express.Router();
const { getAllApplications, createApplication } = require('../controllers/applicationController');
const protect = require('../middleware/authMiddleware');

router.get('/', protect, getAllApplications);
router.post('/', protect, createApplication); 

module.exports = router;