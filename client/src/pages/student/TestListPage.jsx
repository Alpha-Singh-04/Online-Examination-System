import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestListPage = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  // Simulate fetching test data
  useEffect(() => {
    const mockTests = [
      {
        id: 'test001',
        title: 'Math Midterm',
        subject: 'Mathematics',
        duration: 60,
        startTime: '2025-04-08T10:00:00Z',
        endTime: '2025-04-09T10:00:00Z'
      },
      {
        id: 'test002',
        title: 'Physics Basics',
        subject: 'Physics',
        duration: 45,
        startTime: '2025-04-07T14:00:00Z',
        endTime: '2025-04-08T18:00:00Z'
      }
    ];

    // Filter to only currently running tests
    const now = new Date();
    const activeTests = mockTests.filter(test => {
      const start = new Date(test.startTime);
      const end = new Date(test.endTime);
      return now >= start && now <= end;
    });

    setTests(activeTests);
  }, []);

  const handleStartTest = (testId) => {
    navigate(`/student/dashboard/take-test/${testId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Tests</h1>
      
      {tests.length === 0 ? (
        <p className="text-gray-500">No tests are currently running.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map(test => (
            <div key={test.id} className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
              <h2 className="text-xl font-semibold text-blue-800 mb-1">{test.title}</h2>
              <p className="text-gray-600 mb-1"><strong>Subject:</strong> {test.subject}</p>
              <p className="text-gray-600 mb-1"><strong>Duration:</strong> {test.duration} minutes</p>
              <p className="text-sm text-gray-400 mb-3">
                Ends at: {new Date(test.endTime).toLocaleString()}
              </p>
              <button 
                onClick={() => handleStartTest(test.id)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-md transition"
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestListPage;
