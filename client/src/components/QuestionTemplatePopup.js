import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuestionTemplatePopup({ isOpen, onClose, onSearch }) {
  const [examName, setExamName] = useState('');
  const [examOptions, setExamOptions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch the exam names based on current filters
      const fetchOptions = async () => {
        try {
          const response = await axios.get('/api/getQuestionOptions', {
            params: {
              examName,
            },
          });
          setExamOptions(response.data.examNames);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
      };
      fetchOptions();
    }
  }, [ isOpen, examName ]);

  const handleQuestionSearch = async () => {
    try {
      const response = await axios.get('/api/getQuestion', {
        params: {
            examName,
        },
      });
      onSearch(response.data);
      onClose(); // Close the popup after searching
    } catch (error) {
      console.error('Error fetching submission:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Search Answer Template</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Exam Name</label>
          <select
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Exam Name</option>
            {examOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleQuestionSearch}
            className="bg-violet-700 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionTemplatePopup;