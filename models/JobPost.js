// models/JobPost.js
const mongoose = require('mongoose');

const JobPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: String,
  location: String,

  // NEW:
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'working-student', 'contract'],
    index: true
  },
  categories: [{ type: String, index: true }], // e.g. ["engineering", "marketing"]
  minHoursPerWeek: { type: Number, index: true },
  maxHoursPerWeek: { type: Number, index: true },
  isStudentFriendly: { type: Boolean, default: false, index: true },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobPost', JobPostSchema);