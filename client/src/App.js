import React, { useState } from 'react';
import axios from 'axios';
import StudentHistoryPopup from './components/StudentHistoryPopup';

function App() {
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([{ rightAnswer: '', studentAnswer: '', marks: '' }]);
  const [results, setResults] = useState([]);
  const [examName, setExamName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [totalMarks, setTotalMarks] = useState(0);
  const [earnedMarks, setEarnedMarks] = useState(0);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const handleSearch = (submissionData) => {
    console.log(submissionData);
    setExamName(submissionData.examName);
    setStudentName(submissionData.studentName);
    setNumQuestions(submissionData.questions.length);
    setQuestions(submissionData.questions);
    // setResults(submissionData.results);
    setTotalMarks(submissionData.totalMark);
    setEarnedMarks(submissionData.earnedMark);
  };

  const handleNumQuestionsChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumQuestions(count);
    setQuestions(Array.from({ length: count }, () => ({ rightAnswer: '', studentAnswer: '', marks: '' })));
    setResults([]);
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
    let total = 0;
    let earned = 0;
    for (let i = 0; i < numQuestions; i++) {
      try {
        const response = await axios.post('/api/submit', {
          rightAnswer: questions[i].rightAnswer,
          studentAnswer: questions[i].studentAnswer,
          marks: questions[i].marks,
        });
        
        newResults.push({ result: response.data.result, mark: response.data.mark });

        // Accumulate total and earned marks
        total += parseFloat(questions[i].marks);
        earned += response.data.mark;
      } catch (error) {
        console.error('Error submitting answers:', error);
        newResults.push({ result: 'Error', mark: 0 });
      }
    }
    
    setResults(newResults);
    setTotalMarks(total);
    setEarnedMarks(earned);
  };

  const handleSaveQuestion = async () => {
    try {
      const response = await axios.post('/api/save-question', {
        examName,
        numQuestions,
        questions: questions.map((question) => ({
          rightAnswer: question.rightAnswer,
          marks: question.marks,
        })),
        totalMark: totalMarks,
      });
      console.log('Question saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving Question:', error);
    }
  };

  const handleSaveExam = async () => {
    try {
      const response = await axios.post('/api/save-exam', {
        examName,
        studentName,
        numQuestions,
        questions: questions.map((question) => ({
          rightAnswer: question.rightAnswer,
          studentAnswer: question.studentAnswer,          
          marks: question.marks,
        })), // Assuming results contain all the questions with rightAnswer, studentAnswer, and marks
        results: results.map((result) => ({
          result: result.result,
          mark: result.mark,
        })),
        totalMark: totalMarks,
        earnedMark: earnedMarks,        
      });
      console.log('Exam saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  return (
    <div className="p-4 mx-auto" style={{ marginLeft: '100px', marginRight: '100px', maxWidth: '100%' }}>
      <nav className="bg-violet-700 text-white p-4 fixed top-0 left-0 right-0 shadow z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold ml-4">EasyGrade</h1>
          <div>
            <a href="#student-history" onClick={() => setIsPopupOpen(true)} className="mr-4">Student History</a>
            <a href="#question-templates" className="mr-4">Question Templates</a>
            <a href="#about" className="mr-4">About</a>
          </div>
        </div>
      </nav>

      <StudentHistoryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSearch={handleSearch}
      />

      <div className="mt-16 px-16">

        <div className="flex justify-between items-center mb-8 pt-4">
          <div className="relative w-1/4">
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="peer h-full min-h-[40px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-purple-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
            />
            <label
              className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-purple-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-purple-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-purple-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
            >
              Exam Name
            </label>
          </div>
          <div className="relative w-1/4">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="peer h-full min-h-[40px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-purple-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
            />
            <label
              className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-purple-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-purple-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-purple-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
            >
              Student Name
            </label>
          </div>
          <div className="relative w-1/4">
            <input
              type="number"
              value={numQuestions}
              onChange={handleNumQuestionsChange}
              className="peer h-full min-h-[40px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-purple-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
              min={1}
            />
            <label
              className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-purple-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-purple-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-purple-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
            >
              Number of Questions
            </label>
          </div>
        </div>



        {questions.map((question, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-300 rounded shadow w-full">

            <div className="relative">
              <textarea
                value={question.rightAnswer}
                onChange={(e) => handleInputChange(index, 'rightAnswer', e.target.value)}
                className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-purple-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                placeholder=" "
              ></textarea>
              <label
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-purple-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-purple-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-purple-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
              >
                Right Answer for Question {index + 1}
              </label>
            </div>

            <div className="relative mt-4">
              <textarea
                value={question.studentAnswer}
                onChange={(e) => handleInputChange(index, 'studentAnswer', e.target.value)}
                className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-purple-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                placeholder=" "
              ></textarea>
              <label
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-purple-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-purple-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-purple-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
              >
                Student Answer for Question {index + 1}
              </label>
            </div>

            <div className="relative mt-4 w-1/4">
              <input
                type="number"
                value={question.marks}
                onChange={(e) => handleInputChange(index, 'marks', e.target.value)}
                className="peer h-full min-h-[40px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-purple-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                placeholder=" "
                min={0}
              />
              <label
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-purple-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-purple-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-purple-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
              >
                Mark for Question {index + 1}
              </label>
            </div>

          </div>
        ))}

        {results.map((result, index) => (
          <div key={index} className="mt-4 p-2 border-t border-gray-300">
            <h3 className="font-semibold">Result for Question {index + 1}:</h3>
            <p>Feedback: {result.result}</p>
            <p>Mark: {result.mark}</p>
          </div>
        ))}

        <div className="mt-4">
          <h3>Total Marks: {totalMarks}</h3>
          <h3>Marks Earned: {earnedMarks}</h3>
        </div>
        <div>
          <button
            onClick={handleSubmit}
            className="bg-violet-700 text-white p-2 mr-4 mt-4 rounded"
          >
            Submit
          </button>

          <button
            onClick={handleSaveExam}
            className="bg-violet-700 text-white p-2 mr-4 mt-4 rounded"
          >
            Save Exam Results
          </button>

          <button
            onClick={handleSaveQuestion}
            className="bg-violet-700 text-white p-2 rounded"
          >
            Save Question
          </button>
        </div>
        
        
      </div>
    </div>
  );
}

export default App;
