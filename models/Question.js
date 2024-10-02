// models/Question.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  examName: {
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
      marks: Number,
    },
  ],
  totalMark: {
    type: Number,
    default: 0,
  },
}, { collection: 'Question' });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;