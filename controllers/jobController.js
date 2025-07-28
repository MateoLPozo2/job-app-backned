// controllers/jobController.js
const JobPost = require('../models/JobPost');

exports.createJob = async (req, res) => {
  try {
    const { title, company, description } = req.body;
    const job = await JobPost.create({ title, company, description });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};