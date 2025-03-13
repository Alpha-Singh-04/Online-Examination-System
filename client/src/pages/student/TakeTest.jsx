import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TestMonitor from '../../components/TestMonitor';

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [violations, setViolations] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const timerIntervalRef = useRef(null);
  const autoSaveIntervalRef = useRef(null);
  const containerRef = useRef(null);

  const fetchTest = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tests/${testId}/take`);
      
      // Convert startTime and endTime to calculate timeLeft
      const now = new Date();
      const startTime = new Date(testData.startTime);
      const endTime = new Date(testData.endTime);
      const remainingTime = Math.max((endTime - now) / 1000, 0);

      setTest(response.data);
      setTimeLeft(response.data.duration * 60);
      setAnswers(response.data.savedAnswers || response.data.questions.reduce((acc, q) => ({ ...acc, [q._id]: null }), {}));
    } catch (err) {
      setError('Failed to load test. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    fetchTest();
  }, [fetchTest]);

  useEffect(() => {
    if (timeLeft === null || loading) return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerIntervalRef.current);
          handleSubmitTest(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [timeLeft, loading]);

  useEffect(() => {
    if (loading || !test) return;

    const autoSave = async () => {
      try {
        await axios.post(`/api/tests/${testId}/save-progress`, { answers });
      } catch (err) {
        console.error('Failed to auto-save progress:', err);
      }
    };

    autoSaveIntervalRef.current = setInterval(autoSave, 30000);

    return () => clearInterval(autoSaveIntervalRef.current);
  }, [test, testId, answers, loading]);

  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
      clearInterval(autoSaveIntervalRef.current);
      exitFullscreen();
    };
  }, []);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);

  const handleAnswerChange = useCallback((questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const navigateQuestion = useCallback((direction) => {
    setCurrentQuestionIndex((prevIndex) => {
      if (direction === 'prev' && prevIndex > 0) return prevIndex - 1;
      if (direction === 'next' && prevIndex < test.questions.length - 1) return prevIndex + 1;
      return prevIndex;
    });
  }, [test]);

  const handleSubmitTest = useCallback(async (isAutoSubmit = false) => {
    if (isSubmitting) return;

    if (!isAutoSubmit && !window.confirm('Are you sure you want to submit your test? This action cannot be undone.')) return;

    setIsSubmitting(true);

    try {
      clearInterval(timerIntervalRef.current);
      clearInterval(autoSaveIntervalRef.current);
      exitFullscreen();

      const payload = {
        answers: Object.values(answers), // Send as an array of selected strings
        violations: violations.length,
        violationDetails: violations,
        timeSpent: test.duration * 60 - timeLeft,
      };

      await axios.post(`/api/tests/${testId}/submit`, payload);
      navigate(`/student/results/${testId}`);
    } catch (err) {
      setError('Failed to submit test. Please try again.');
      console.error(err);
      setIsSubmitting(false);
    }
  }, [isSubmitting, answers, violations, timeLeft, test, testId, navigate]);

  const enterFullscreen = useCallback(() => {
    const element = containerRef.current;
    if (element) {
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
      else if (element.msRequestFullscreen) element.msRequestFullscreen();
      setIsFullScreen(true);
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setIsFullScreen(false);
    }
  }, []);

  const handleViolation = useCallback((type, details = '') => {
    setViolations((prev) => [...prev, { type, timestamp: new Date().toISOString(), details }]);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      if (!document.fullscreenElement && isFullScreen) {
        handleViolation('FULLSCREEN_EXIT', 'User exited full screen mode');
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, [isFullScreen, handleViolation]);

  const currentQuestion = useMemo(() => test?.questions[currentQuestionIndex], [test, currentQuestionIndex]);

  if (loading) return <div className="text-center p-8">Loading test...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!test) return <div className="text-center p-8">Test not found.</div>;

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50">
      <TestMonitor onViolation={handleViolation} />
      <div className="p-4 bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold truncate">{test.title}</h1>
          <div className="flex items-center gap-4">
            <div className="text-red-600 font-medium">Time Left: {formatTime(timeLeft)}</div>
            <button
              onClick={isFullScreen ? exitFullscreen : enterFullscreen}
              className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              {isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {test.questions.map((q, idx) => (
            <button
              key={q._id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${currentQuestionIndex === idx ? 'bg-blue-500 text-white' : 
                  answers[q._id] !== null ? 'bg-green-100 text-green-800' : 'bg-gray-200'}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <div className="mb-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-medium">Question {currentQuestionIndex + 1}</h2>
              <span className="text-gray-500">Marks: {currentQuestion.marks}</span>
            </div>
            <p className="mt-2">{currentQuestion.question}</p>
          </div>
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="flex items-start">
                <input
                  type="radio"
                  id={`option-${idx}`}
                  name={`question-${currentQuestion._id}`}
                  checked={answers[currentQuestion._id] === idx}
                  onChange={() => handleAnswerChange(currentQuestion._id, idx)}
                  className="mt-1 mr-3"
                />
                <label htmlFor={`option-${idx}`} className="cursor-pointer">
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigateQuestion('prev')}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {currentQuestionIndex < test.questions.length - 1 ? (
            <button
              onClick={() => navigateQuestion('next')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => handleSubmitTest(false)}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </button>
          )}
        </div>
        
        {/* Warning Banner for Violations */}
        {violations.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <p className="font-medium">
              Warning: {violations.length} suspicious activity detected. These will be reported to your instructor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeTest;