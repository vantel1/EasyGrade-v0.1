// routes/submissions.js

const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const { generateGrade } = require('../services/openaiService');

// Route to submit answers and compute results using OpenAI API
router.post('/submit', async (req, res) => {
  const { rightAnswer, studentAnswer, marks } = req.body;

  try {
    // Use OpenAI to generate feedback and a score
    const aiResponse = await generateGrade(rightAnswer, studentAnswer, marks);

    // Example: parse the response to extract the score (you may need to adjust based on actual response)
    const regex1 = new RegExp(`Score: ([0-9]*[.])?[0-9]+/${marks}`);
    const match1 = aiResponse.match(regex1); // Extract the score from the AI's response
    const score = match1[0].split('/')[0].split(' ')[1];

    console.log(score);

    const regex2 = new RegExp('Feedback:\\s([\\s\\S]*)', 'i');
    const match2 = aiResponse.match(regex2);
    const result = match2[1].trim();

    console.log(result);
    
    const mark = parseFloat(score);

    res.status(201).json({ result, mark });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate grade' });
  }
});

module.exports = router;
