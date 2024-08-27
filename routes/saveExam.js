// routes/saveExam.js

const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

router.post('/save-exam', async (req, res) => {
  const { examName, studentName, questions, totalMark, earnedMark } = req.body;

  try {
    const newSubmission = new Submission({
      examName,
      studentName,
      questions, // Assuming questions contain { rightAnswer, studentAnswer, result, mark, marks }
      totalMark,
      earnedMark,
    });

    await newSubmission.save();
    console.log('Exam saved successfully');

    res.status(201).json({ message: 'Exam saved successfully', submission: newSubmission });
  } catch (error) {
    console.error('Error saving exam:', error);
    res.status(500).json({ error: 'Failed to save exam' });
  }
});

module.exports = router;
