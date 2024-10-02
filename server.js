// server.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const submissionRoutes = require('./routes/submissions');
const saveExamRoute = require('./routes/saveExam');
const studentHistoryRoute = require('./routes/studentHistory');
const saveQuestionRoute = require('./routes/saveQuestion');
const questionTemplatesRoute = require('./routes/questionTemplates');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/auto-grading');

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});
mongoose.set('debug', true);

// Use Routes
app.use('/api', submissionRoutes);
app.use('/api', saveExamRoute);
app.use('/api', studentHistoryRoute);
app.use('/api', saveQuestionRoute);
app.use('/api', questionTemplatesRoute);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
