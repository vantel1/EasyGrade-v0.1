// client/src/App.js

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [rightAnswer, setRightAnswer] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [result, setResult] = useState('');
  const [mark, setMark] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/submit', { rightAnswer, studentAnswer });
      setResult(response.data.result);
      setMark(response.data.mark);
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  return (
    <div>
      <h1>Auto Grading System</h1>
      <label>Right Answer:</label>
      <input type="text" value={rightAnswer} onChange={(e) => setRightAnswer(e.target.value)} />
      <br />
      <label>Student Answer:</label>
      <input type="text" value={studentAnswer} onChange={(e) => setStudentAnswer(e.target.value)} />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {result && (
        <div>
          <h3>Result: {result}</h3>
          <p>Mark: {mark}</p>
        </div>
      )}
    </div>
  );
}

export default App;
