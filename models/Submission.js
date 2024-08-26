// models/Submission.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  rightAnswer: {
    type: String,
    required: true,
  },
  studentAnswer: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    default: '',
  },
  mark: {
    type: Number,
    default: 0,
  },
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
