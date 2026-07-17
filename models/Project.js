const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  summary: { type: String, required: true },
  description: { type: String, default: '' },
  stack: [{ type: String }],          // e.g. ["Kotlin", "Firebase", "Retrofit"]
  pipeline: [{ type: String }],       // e.g. ["Code", "Build", "Test", "Deploy"] - drives the UI's pipeline strip
  status: {
    type: String,
    enum: ['live', 'in-progress', 'archived'],
    default: 'live'
  },
  repoUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
