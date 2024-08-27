import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([{ rightAnswer: '', studentAnswer: '' }]);
  const [results, setResults] = useState([]);

  const handleNumQuestionsChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumQuestions(count);
    setQuestions(Array.from({ length: count }, () => ({ rightAnswer: '', studentAnswer: '' })));
    setResults(Array.from({ length: count }, () => ({ result: '', mark: '' })));
  };

  const handleInputChange = (index, field, value) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return newQuestions;
    });
  };

  const handleSubmit = async () => {
    const newResults = [];
    for (let i = 0; i < numQuestions; i++) {
      try {
        const response = await axios.post('/api/submit', {
          rightAnswer: questions[i].rightAnswer,
          studentAnswer: questions[i].studentAnswer,
        });
        newResults.push({ result: response.data.result, mark: response.data.mark });
      } catch (error) {
        console.error('Error submitting answers:', error);
        newResults.push({ result: 'Error', mark: 0 });
      }
    }
    setResults(newResults);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auto Grading System</h1>
      <label className="block mb-2">Number of Questions:</label>
      <input
        type="number"
        value={numQuestions}
        onChange={handleNumQuestionsChange}
        className="block mb-4 p-2 border border-gray-300 rounded"
        min={1}
      />
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <label className="block">Right Answer for Question {index + 1}:</label>
          <input
            type="text"
            value={question.rightAnswer}
            onChange={(e) => handleInputChange(index, 'rightAnswer', e.target.value)}
            className="block mb-2 p-2 border border-gray-300 rounded"
          />
          <label className="block">Student Answer for Question {index + 1}:</label>
          <input
            type="text"
            value={question.studentAnswer}
            onChange={(e) => handleInputChange(index, 'studentAnswer', e.target.value)}
            className="block mb-2 p-2 border border-gray-300 rounded"
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Submit
      </button>
      {results.map((result, index) => (
        <div key={index} className="mt-4 p-2 border-t border-gray-300">
          <h3 className="font-semibold">Result for Question {index + 1}:</h3>
          <p>Feedback: {result.result}</p>
          <p>Mark: {result.mark}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
