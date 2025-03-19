
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import BarChart from '../../components/Analytics/BarChart';
import PieChart from '../../components/Analytics/PieChart';

const ResultsDashboard = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('/api/tests/created', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTests(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };
    
    fetchTests();
  }, []);

  const fetchTestResults = async (testId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/analytics/test/${testId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTestResults(response.data);
      setSelectedTest(tests.find(test => test._id === testId));
    } catch (error) {
      console.error('Error fetching test results:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      const response = await axios.get(`/api/reports/test/${selectedTest._id}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedTest.title}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test Results & Analytics</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Test</label>
        <select 
          className="w-full p-2 border rounded-md"
          onChange={(e) => fetchTestResults(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Select a test</option>
          {tests.map(test => (
            <option key={test._id} value={test._id}>
              {test.title} ({new Date(test.startTime).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>
      
      {loading && <p>Loading results...</p>}
      
      {testResults && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{selectedTest.title} Results</h2>
            <button 
              onClick={generatePDF}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Generate PDF Report
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Overall Statistics</h3>
              <p><span className="font-medium">Average Score:</span> {testResults.averageScore}%</p>
              <p><span className="font-medium">Highest Score:</span> {testResults.highestScore}%</p>
              <p><span className="font-medium">Lowest Score:</span> {testResults.lowestScore}%</p>
              <p><span className="font-medium">Pass Rate:</span> {testResults.passRate}%</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Completion Stats</h3>
              <p><span className="font-medium">Total Students:</span> {testResults.totalStudents}</p>
              <p><span className="font-medium">Completed:</span> {testResults.submissionsCount}</p>
              <p><span className="font-medium">Completion Rate:</span> {testResults.completionRate}%</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Time Stats</h3>
              <p><span className="font-medium">Avg. Completion Time:</span> {testResults.avgCompletionTime} mins</p>
              <p><span className="font-medium">Fastest Completion:</span> {testResults.fastestCompletion} mins</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Score Distribution</h3>
              <BarChart data={testResults.scoreDistribution} />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Performance by Question</h3>
              <PieChart data={testResults.questionPerformance} />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Student Results</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Student</th>
                    <th className="py-2 px-4 text-left">Score</th>
                    <th className="py-2 px-4 text-left">Time Taken</th>
                    <th className="py-2 px-4 text-left">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.studentResults.map((result) => (
                    <tr key={result.userId} className="border-b">
                      <td className="py-2 px-4">{result.studentName}</td>
                      <td className="py-2 px-4">{result.score}%</td>
                      <td className="py-2 px-4">{result.timeTaken} mins</td>
                      <td className="py-2 px-4">{new Date(result.submittedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;