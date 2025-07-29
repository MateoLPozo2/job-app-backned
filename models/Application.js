// models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
  coverLetter: { type: String },
  createdAt: { type: Date, default: Date.now },
  resume: { type: String}
});

module.exports = mongoose.model('Application', ApplicationSchema);