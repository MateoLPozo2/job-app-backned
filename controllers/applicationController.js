const Application = require('../models/Application');

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('user', 'name email')
      .populate('job', 'title company');
    res.status(200).json(applications);
  } catch (err) {
    console.error('[getAllApplications] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('user', 'name email')
      .populate('job', 'title company employmentType location');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    console.error('[getApplicationById] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createApplication = async (req, res) => {
  try {
    const { job, coverLetter } = req.body;
    const user = req.user._id;
    if (!job) return res.status(400).json({ message: 'job is required' });

    const newApp = await Application.create({ user, job, coverLetter });
    res.status(201).json(newApp);
  } catch (err) {
    console.error('[createApplication] error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllApplications, getApplicationById, createApplication };