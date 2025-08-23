// controllers/jobController.js
const JobPost = require('../models/JobPost');

const createJob = async (req, res) => {
  console.log('[createJob] ENTER');
  try {
    let {
      title, company, description, location, employmentType,
      categories, minHoursPerWeek, maxHoursPerWeek, isStudentFriendly
    } = req.body;

    // Normalize categories to array
    let normalizedCategories;
    if (Array.isArray(categories)) {
      normalizedCategories = categories;
    } else if (typeof categories === 'string' && categories.trim() !== '') {
      normalizedCategories = categories.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      normalizedCategories = [];
    }

    // Normalize numeric fields
    minHoursPerWeek = minHoursPerWeek !== undefined ? Number(minHoursPerWeek) : undefined;
    maxHoursPerWeek = maxHoursPerWeek !== undefined ? Number(maxHoursPerWeek) : undefined;

    // Normalize boolean
    isStudentFriendly = isStudentFriendly === true || isStudentFriendly === 'true';

    const job = new JobPost({
      title,
      company,
      description,
      location,
      employmentType,
      categories: normalizedCategories,
      minHoursPerWeek,
      maxHoursPerWeek,
      isStudentFriendly
    });

    await job.save();
    console.log('[createJob] EXIT');
    res.status(201).json(job);
  } catch (err) {
    console.error('[createJob] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllJobs = async (req, res) => {
  console.log('[getAllJobs] ENTER');
  try {
    // Optionally support query filtering here
    const jobs = await JobPost.find();
    console.log('[getAllJobs] EXIT');
    res.json(jobs);
  } catch (err) {
    console.error('[getAllJobs] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const getJobById = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error('[getJobById] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateJob = async (req, res) => {
  try {
    const {
      title, company, description, location, employmentType,
      categories, minHoursPerWeek, maxHoursPerWeek, isStudentFriendly
    } = req.body;

    let normalizedCategories;
    if (Array.isArray(categories)) normalizedCategories = categories;
    else if (typeof categories === 'string' && categories.trim() !== '')
      normalizedCategories = categories.split(',').map(s => s.trim()).filter(Boolean);

    const updates = {
      ...(title !== undefined && { title }),
      ...(company !== undefined && { company }),
      ...(description !== undefined && { description }),
      ...(location !== undefined && { location }),
      ...(employmentType !== undefined && { employmentType }),
      ...(normalizedCategories !== undefined && { categories: normalizedCategories }),
      ...(minHoursPerWeek !== undefined && { minHoursPerWeek: Number(minHoursPerWeek) }),
      ...(maxHoursPerWeek !== undefined && { maxHoursPerWeek: Number(maxHoursPerWeek) }),
      ...(isStudentFriendly !== undefined && {
        isStudentFriendly: isStudentFriendly === true || isStudentFriendly === 'true'
      }),
    };

    const job = await JobPost.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error('[updateJob] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await JobPost.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error('[deleteJob] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };