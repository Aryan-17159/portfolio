const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['language', 'framework', 'infra', 'database', 'tool'],
    required: true
  },
  level: { type: Number, min: 0, max: 100, default: 70 }, // used for the meter bar
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Skill', SkillSchema);
