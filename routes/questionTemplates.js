const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

router.get('/getQuestionOptions', async (req, res) => {
  const { examName } = req.query;

  try {
    const examNames = await Question.distinct('examName', examName ? { examName } : {});
    res.json({ examNames });    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch options' });
  }
});

router.get('/getQuestion', async (req, res) => {
  const { examName } = req.query;

  try {
    const question = await Question.findOne({ examName });
    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ error: 'Question not found' });    
    } 
  }catch (error) {
    res.status(501).json({ error: 'Failed to fetch question' });
  }
});

module.exports = router;