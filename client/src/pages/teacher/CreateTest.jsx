import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExam } from '../../services/examService';
import { toast } from 'react-toastify';

const TestDetails = ({ testData, handleTestDataChange }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h2 className="text-xl font-semibold mb-4">Test Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <InputField label="Test Title*" name="title" value={testData.title} onChange={handleTestDataChange} required />
      <InputField label="Subject*" name="subject" value={testData.subject} onChange={handleTestDataChange} required />
    </div>

    <InputField label="Teacher" name="teacher" value={testData.teacher} onChange={handleTestDataChange} />
    <TextAreaField label="Description" name="description" value={testData.description} onChange={handleTestDataChange} rows="3" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <InputField label="Duration (minutes)*" name="duration" type="number" value={testData.duration} onChange={handleTestDataChange} min="1" required />
      <div>
        <label className="block text-gray-700 mb-1">Start Time*</label>
        <input
          type="datetime-local"
          name="startTime"
          value={testData.startTime}
          onChange={handleTestDataChange}
          min={new Date().toISOString().slice(0, 16)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">End Time*</label>
        <input
          type="datetime-local"
          name="endTime"
          value={testData.endTime}
          onChange={handleTestDataChange}
          min={testData.startTime || new Date().toISOString().slice(0, 16)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
    </div>
    <TextAreaField label="Instructions" name="instructions" value={testData.instructions} onChange={handleTestDataChange} rows="3" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CheckboxField label="Shuffle Questions" name="shuffleQuestions" checked={testData.shuffleQuestions} onChange={handleTestDataChange} />
      <CheckboxField label="Allow Backtracking" name="allowBacktracking" checked={testData.allowBacktracking} onChange={handleTestDataChange} />
      <InputField label="Passing Percentage" name="passingPercentage" type="number" value={testData.passingPercentage} onChange={handleTestDataChange} min="0" max="100" />
    </div>
  </div>
);

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 mb-1">{label}</label>
    <input className="w-full p-2 border rounded" {...props} />
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-gray-700 mb-1">{label}</label>
    <textarea className="w-full p-2 border rounded" {...props}></textarea>
  </div>
);

const CheckboxField = ({ label, ...props }) => (
  <div className="flex items-center">
    <input type="checkbox" className="mr-2" {...props} />
    <label>{label}</label>
  </div>
);

const Question = ({ question, qIndex, handleQuestionChange, handleOptionChange, handleCorrectAnswerChange, addOption, removeOption, removeQuestion }) => (
  <div className="mb-8 p-4 border rounded bg-gray-50">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-medium">Question {qIndex + 1}</h3>
      <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 hover:text-red-700">Remove</button>
    </div>
    <TextAreaField label="Question Text*" value={question.question} onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)} rows="2" required />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-gray-700 mb-1">Question Type</label>
        <select 
          value={question.questionType} 
          onChange={(e) => {
            const newType = e.target.value;
            handleQuestionChange(qIndex, 'questionType', newType);
            // Reset options based on question type
            if (newType === 'true-false') {
              handleQuestionChange(qIndex, 'options', [
                { text: 'True' },
                { text: 'False' }
              ]);
            } else if (newType === 'written') {
              handleQuestionChange(qIndex, 'options', []);
            } else {
              handleQuestionChange(qIndex, 'options', [
                { text: '' },
                { text: '' },
                { text: '' },
                { text: '' }
              ]);
            }
          }} 
          className="w-full p-2 border rounded"
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True/False</option>
          <option value="written">Written Answer</option>
        </select>
      </div>
      <InputField label="Marks" type="number" value={question.marks} onChange={(e) => handleQuestionChange(qIndex, 'marks', parseInt(e.target.value) || 1)} min="1" />
    </div>
    
    {question.questionType !== 'written' && (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-gray-700">Options</label>
          {question.questionType === 'multiple-choice' && (
            <button type="button" onClick={() => addOption(qIndex)} className="text-sm text-blue-500 hover:text-blue-700">Add Option</button>
          )}
        </div>
        {question.options.map((option, oIndex) => (
          <div key={oIndex} className="flex items-center mb-2">
            <input 
              type="radio" 
              name={`correct-${question.id}`} 
              checked={question.correctAnswer === option.text} 
              onChange={() => handleCorrectAnswerChange(qIndex, option.text)} 
              className="mr-2" 
            />
            <input 
              type="text" 
              value={option.text} 
              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} 
              className="flex-1 p-2 border rounded" 
              placeholder={`Option ${oIndex + 1}`} 
              required 
              disabled={question.questionType === 'true-false'}
            />
            {question.questionType === 'multiple-choice' && (
              <button 
                type="button" 
                onClick={() => removeOption(qIndex, oIndex)} 
                className="ml-2 text-red-500 hover:text-red-700"
                disabled={question.options.length <= 2}
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

const CreateTest = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [testData, setTestData] = useState({
    title: '',
    subject: '',
    teacher: '', 
    description: '',
    duration: 60,
    instructions: '',
    startTime: '',
    endTime: '',
    shuffleQuestions: true,
    allowBacktracking: false,
    passingPercentage: 60,
  });

  const [questions, setQuestions] = useState([{
    id: Date.now(),
    question: '',
    questionType: 'multiple-choice',
    options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
    correctAnswer: '',
    marks: 1,
  }]);

  const handleTestDataChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setTestData(prevData => {
      const newData = {
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      };
      
      // Validate end time is after start time
      if (name === 'startTime' || name === 'endTime') {
        if (newData.startTime && newData.endTime) {
          const start = new Date(newData.startTime);
          const end = new Date(newData.endTime);
          if (end <= start) {
            setError('End time must be after start time');
          } else {
            setError('');
          }
        }
      }
      
      return newData;
    });
  }, []);

  const handleQuestionChange = useCallback((index, field, value) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index][field] = value;
      return updatedQuestions;
    });
  }, []);

  const handleOptionChange = useCallback((questionIndex, optionIndex, value) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].options[optionIndex].text = value;
      return updatedQuestions;
    });
  }, []);

  const handleCorrectAnswerChange = useCallback((questionIndex, optionIndex) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].correctAnswer = optionIndex;
      return updatedQuestions;
    });
  }, []);

  const addQuestion = useCallback(() => {
    setQuestions(prevQuestions => [
      ...prevQuestions,
      {
        id: Date.now(),
        question: '',
        questionType: 'multiple-choice',
        options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
        correctAnswer: '',
        marks: 1,
      },
    ]);
  }, []);

  const removeQuestion = useCallback((index) => {
    setQuestions(prevQuestions => {
      if (prevQuestions.length > 1) {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions.splice(index, 1);
        return updatedQuestions;
      }
      return prevQuestions;
    });
  }, []);

  const addOption = useCallback((questionIndex) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].options.push({ text: '' });
      return updatedQuestions;
    });
  }, []);

  const removeOption = useCallback((questionIndex, optionIndex) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      if (updatedQuestions[questionIndex].options.length > 2) {
        updatedQuestions[questionIndex].options.splice(optionIndex, 1);
        if (updatedQuestions[questionIndex].correctAnswer === optionIndex) {
          updatedQuestions[questionIndex].correctAnswer = 0;
        } else if (updatedQuestions[questionIndex].correctAnswer > optionIndex) {
          updatedQuestions[questionIndex].correctAnswer -= 1;
        }
        return updatedQuestions;
      }
      return prevQuestions;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Submitting exam data:', testData); // Debug log
      
      if (!testData.title || !testData.subject || !testData.duration || !testData.startTime || !testData.endTime) {
        throw new Error('Please fill all required test fields');
      }

      const startTime = new Date(testData.startTime);
      const endTime = new Date(testData.endTime);
      if (endTime <= startTime) {
        throw new Error('End time must be after start time');
      }

      const validQuestions = questions.every(q => {
        if (q.question.trim() === '') return false;
        if (q.questionType === 'written') return true;
        return q.options.every(opt => opt.text.trim() !== '') && q.correctAnswer;
      });

      if (!validQuestions) {
        throw new Error('Please fill all question fields and select correct answers');
      }

      const testPayload = {
        ...testData,
        startTime,
        endTime,
        questions: questions.map(q => ({
          question: q.question,
          questionType: q.questionType,
          options: q.options,
          correctAnswer: q.correctAnswer,
          marks: q.marks,
        })),
      };

      console.log('Sending payload to server:', testPayload); // Debug log
      const response = await createExam(testPayload);
      console.log('Server response:', response); // Debug log
      
      toast.success('Exam created successfully!');
      navigate(`/teacher/tests/${response.testId}`);
    } catch (err) {
      console.error('Error creating exam:', err); // Debug log
      setError(err.message || 'Failed to create test. Please try again.');
      toast.error(err.message || 'Failed to create test');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Create New Test</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <TestDetails testData={testData} handleTestDataChange={handleTestDataChange} />
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Questions</h2>
          {questions.map((question, qIndex) => (
            <Question
              key={question.id}
              question={question}
              qIndex={qIndex}
              handleQuestionChange={handleQuestionChange}
              handleOptionChange={handleOptionChange}
              handleCorrectAnswerChange={handleCorrectAnswerChange}
              addOption={addOption}
              removeOption={removeOption}
              removeQuestion={removeQuestion}
            />
          ))}
          <div className="mt-6 flex justify-center">
            <button 
              type="button" 
              onClick={addQuestion} 
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Question
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg font-medium text-lg disabled:opacity-50">
            {isSubmitting ? 'Creating...' : 'Create Test'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTest;
