// routes/submissions.js

const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const { generateGrade } = require('../services/openaiService');

// Route to submit answers and compute results using OpenAI API
router.post('/submit', async (req, res) => {
  const { rightAnswer, studentAnswer } = req.body;

  try {
    // Use OpenAI to generate feedback and a score
    const aiResponse = await generateGrade(rightAnswer, studentAnswer);

    // Example: parse the response to extract the score (you may need to adjust based on actual response)
    const result = aiResponse; // Assuming AI returns a text with feedback and score
    const score = aiResponse.match(/(\d+)\/10/)[1]; // Extract the score from the AI's response
    const mark = parseInt(score, 10);

    // Save submission to MongoDB
    const newSubmission = new Submission({ rightAnswer, studentAnswer, result, mark });
    await newSubmission.save();

    res.status(201).json({ result, mark });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate grade' });
  }
});

module.exports = router;
