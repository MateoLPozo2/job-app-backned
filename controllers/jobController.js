// controllers/jobController.js
const JobPost = require('../models/JobPost');

/**
 * @desc    Create a job post
 * @route   POST /api/jobs
 * @access  Protected (JWT) - depending on your routes/middleware
 */
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      employmentType,      // 'part-time' | 'internship' | 'working-student' | ...
      categories,          // array of strings or comma-separated string
      minHoursPerWeek,
      maxHoursPerWeek,
      isStudentFriendly
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({ message: 'title and company are required' });
    }

    // Normalize categories: accept either array or comma-separated string
    let normalizedCategories = [];
    if (Array.isArray(categories)) {
      normalizedCategories = categories;
    } else if (typeof categories === 'string' && categories.trim() !== '') {
      normalizedCategories = categories.split(',').map(s => s.trim()).filter(Boolean);
    }

    const job = await JobPost.create({
      title,
      company,
      description,
      location,
      employmentType,
      categories: normalizedCategories,
      minHoursPerWeek: minHoursPerWeek !== undefined ? Number(minHoursPerWeek) : undefined,
      maxHoursPerWeek: maxHoursPerWeek !== undefined ? Number(maxHoursPerWeek) : undefined,
      isStudentFriendly: isStudentFriendly === true || isStudentFriendly === 'true'
    });

    res.status(201).json(job);
  } catch (err) {
    console.error('[createJob] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    List jobs with filtering & search
 * @route   GET /api/jobs
 * @query   employmentType, category, minHours, maxHours, studentOnly, location, q, limit, sort
 * @access  Public
 */
exports.getAllJobs = async (req, res) => {
  try {
    const {
      employmentType,
      category,            // single category filter
      minHours,            // number
      maxHours,            // number
      studentOnly,         // 'true' | 'false'
      location,
      q,                   // text search
      limit = 50,
      sort = '-createdAt'  // e.g., 'createdAt' or '-createdAt'
    } = req.query;

    const filter = {};

    if (employmentType) filter.employmentType = employmentType;
    if (category) filter.categories = category;
    if (location) filter.location = location;

    if (studentOnly === 'true') filter.isStudentFriendly = true;
    if (studentOnly === 'false') filter.isStudentFriendly = false;

    // Hours overlap logic
    if (minHours !== undefined) {
      filter.maxHoursPerWeek = { $gte: Number(minHours) };
    }
    if (maxHours !== undefined) {
      filter.minHoursPerWeek = Object.assign(
        {},
        filter.minHoursPerWeek || {},
        { $lte: Number(maxHours) }
      );
    }

    // Build query
    let query = JobPost.find(filter);

    // Optional simple text search
    if (q && q.trim() !== '') {
      // Use $text if available, otherwise regex OR
      query = query.find({
        $or: [
          { title:       new RegExp(q, 'i') },
          { company:     new RegExp(q, 'i') },
          { description: new RegExp(q, 'i') }
        ]
      });
    }

    const jobs = await query.sort(sort).limit(Math.min(Number(limit) || 50, 200));
    res.status(200).json(jobs);
  } catch (err) {
    console.error('[getAllJobs] error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};