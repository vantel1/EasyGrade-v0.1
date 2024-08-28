const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

// Route to get possible exam names and student names based on filters
router.get('/getOptions', async (req, res) => {
  const { examName, studentName } = req.query;

  try {
    const examNames = await Submission.distinct('examName', examName ? { examName } : {});
    const studentNames = await Submission.distinct('studentName', studentName ? { studentName } : {});
    res.json({ examNames, studentNames });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch options' });
  }
});

// Route to get submission by exam name and student name
router.get('/getSubmission', async (req, res) => {
  const { examName, studentName } = req.query;

  try {
    const submission = await Submission.findOne({ examName, studentName });
    if (submission) {      
      res.json(submission);
    } else {
      res.status(404).json({ error: 'Submission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

module.exports = router;
