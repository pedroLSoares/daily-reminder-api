const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: [true, 'Email must be unique'],
  },
  password: { type: String, required: true },
  email_verified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', User);
