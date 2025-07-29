// controllers/applicationController.js
const Application = require('../models/Application');

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('user', 'name email')        // only show user name/email
      .populate('job', 'title company');     // only show job title/company
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createApplication = async (req, res) => {
  try {
    const { job, coverLetter } = req.body;
    const user = req.user._id;

    // Debug print
    console.log("Trying to create Application with:", { user, job, coverLetter });

    const newApp = await Application.create({
      user,
      job,
      coverLetter
    });

    res.status(201).json(newApp);
  } catch (err) {
    // Print the actual error to console!
    console.error('CREATE APPLICATION ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};