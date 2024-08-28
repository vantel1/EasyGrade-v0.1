// models/Submission.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  examName: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  numQuestions: {
    type: Number,
    required: true,
  },
  questions: [
    {
      rightAnswer: String,
      studentAnswer: String,
      result: String,
      mark: Number,
      marks: Number,
    },
  ],
  results: [
    {
      result: String,
      mark: Number,
    },
  ],
  totalMark: {
    type: Number,
    default: 0,
  },
  earnedMark: {
    type: Number,
    default: 0,
  },
}, { collection: 'Submission' });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
