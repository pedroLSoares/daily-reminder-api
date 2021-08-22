const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Task = new Schema({
  name: { type: String, required: true },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Task', Task);
