// routes/questions.js

const express = require('express');
const router = express.Router();
const Question = require('../models/Question');


// Route to store a Question data to MongoDB
router.post('/save-question', async (req, res) => {
    const { examName, numQuestions, questions, totalMark} = req.body;

    try {
      const newQuestion = new Question({
        examName,
        numQuestions,
        questions, // Assuming questions contain { rightAnswer, marks }
        totalMark,
      });

      await newQuestion.save();
      console.log('Question saved successfully');

      res.status(201).json({ message: 'Question saved successfully', question: newQuestion });      
    } catch (error) {
      console.error('Error saving question:', error);
      res.status(500).json({ error: 'Failed to save question' });
    }
});

module.exports = router;