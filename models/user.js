const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  image: { type: String, default: null },
  token: { type: String, default: null }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const User = mongoose.model('User', userSchema);

module.exports = User;
