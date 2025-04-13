import React, { useState, useEffect } from 'react';
// Import icons from a library you're using (e.g., react-icons or lucide-react)
// If you're using lucide-react:
import { 
  BarChart2, 
  Download, 
  Filter, 
  Eye, 
  Calendar, 
  Search, 
  User, 
  Book,
  ArrowUpDown 
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const TeacherViewResults = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [scoresSortOrder, setScoresSortOrder] = useState('desc');

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      setTests([
        {
          id: 1,
          name: 'Midterm Exam',
          subject: 'Mathematics',
          date: '2025-03-15',
          studentsCount: 32,
          avgScore: 78.5,
          completionRate: 94,
          highestScore: 98,
          lowestScore: 45,
          students: [
            { id: 1, name: 'John Doe', score: 98, timeTaken: 45, status: 'Completed' },
            { id: 2, name: 'Jane Smith', score: 85, timeTaken: 52, status: 'Completed' },
            { id: 3, name: 'Mike Johnson', score: 76, timeTaken: 58, status: 'Completed' },
            { id: 4, name: 'Sarah Williams', score: 92, timeTaken: 48, status: 'Completed' },
            { id: 5, name: 'Tom Brown', score: 45, timeTaken: 60, status: 'Completed' }
          ]
        },
        {
          id: 2,
          name: 'Weekly Quiz',
          subject: 'Science',
          date: '2025-03-10',
          studentsCount: 29,
          avgScore: 82.3,
          completionRate: 100,
          highestScore: 100,
          lowestScore: 65,
          students: [
            { id: 1, name: 'John Doe', score: 100, timeTaken: 35, status: 'Completed' },
            { id: 2, name: 'Jane Smith', score: 88, timeTaken: 42, status: 'Completed' },
            { id: 3, name: 'Mike Johnson', score: 79, timeTaken: 48, status: 'Completed' },
            { id: 4, name: 'Sarah Williams', score: 95, timeTaken: 38, status: 'Completed' },
            { id: 5, name: 'Tom Brown', score: 65, timeTaken: 50, status: 'Completed' }
          ]
        },
        {
          id: 3,
          name: 'Chapter Assessment',
          subject: 'History',
          date: '2025-03-08',
          studentsCount: 30,
          avgScore: 76.8,
          completionRate: 90,
          highestScore: 95,
          lowestScore: 52,
          students: [
            // ... other test objects with similar structure
          ]
        },
        {
          id: 4,
          name: 'Final Exam',
          subject: 'English',
          date: '2025-03-05',
          studentsCount: 31,
          avgScore: 81.2,
          completionRate: 97,
          highestScore: 99,
          lowestScore: 60,
          students: [
            // ... other test objects with similar structure
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter tests based on search query and subject filter
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || test.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  // Get unique subjects for filter dropdown
  const subjects = ['all', ...new Set(tests.map(test => test.subject))];

  const handleTestSelect = (test) => {
    setSelectedTest(test);
  };

  // Function to generate score distribution data
  const generateScoreDistribution = (students) => {
    const ranges = [
      { range: '0-20', min: 0, max: 20, count: 0 },
      { range: '21-40', min: 21, max: 40, count: 0 },
      { range: '41-60', min: 41, max: 60, count: 0 },
      { range: '61-80', min: 61, max: 80, count: 0 },
      { range: '81-100', min: 81, max: 100, count: 0 }
    ];

    students.forEach(student => {
      const score = student.score;
      const range = ranges.find(r => score >= r.min && score <= r.max);
      if (range) {
        range.count++;
      }
    });

    return ranges;
  };

  return (
    <div className="p-6 max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">View Results</h1>
          <p className="text-gray-500">Monitor student performance and test results</p>
        </div>
        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          <Download className="mr-2 h-4 w-4" /> Export All Results
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Book className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Tests</p>
              <h3 className="text-xl font-bold">{tests.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Students Tested</p>
              <h3 className="text-xl font-bold">{tests.reduce((sum, test) => sum + test.studentsCount, 0)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <BarChart2 className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Average Score</p>
              <h3 className="text-xl font-bold">
                {tests.length ? 
                  (tests.reduce((sum, test) => sum + test.avgScore, 0) / tests.length).toFixed(1) + '%' 
                  : 'N/A'}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Last Test Date</p>
              <h3 className="text-xl font-bold">
                {tests.length ? 
                  new Date(Math.max(...tests.map(t => new Date(t.date)))).toLocaleDateString() 
                  : 'N/A'}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Tests
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'recent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('recent')}
          >
            Recent
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'scores' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('scores')}
          >
            Scores
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'all' && (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-[180px]">
                <select 
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tests Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="p-4 font-medium text-gray-500">Test Name</th>
                      <th className="p-4 font-medium text-gray-500">Subject</th>
                      <th className="p-4 font-medium text-gray-500">Date</th>
                      <th className="p-4 font-medium text-gray-500">Students</th>
                      <th className="p-4 font-medium text-gray-500">Avg. Score</th>
                      <th className="p-4 font-medium text-gray-500">Completion</th>
                      <th className="p-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="p-4 text-center">Loading test results...</td>
                      </tr>
                    ) : filteredTests.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-4 text-center">No test results found.</td>
                      </tr>
                    ) : (
                      filteredTests.map((test) => (
                        <tr key={test.id} className="border-t hover:bg-gray-50">
                          <td className="p-4 font-medium">{test.name}</td>
                          <td className="p-4">{test.subject}</td>
                          <td className="p-4">{new Date(test.date).toLocaleDateString()}</td>
                          <td className="p-4">{test.studentsCount}</td>
                          <td className="p-4">
                            <span className={`font-medium ${test.avgScore >= 80 ? 'text-green-600' : test.avgScore >= 70 ? 'text-blue-600' : 'text-orange-600'}`}>
                              {test.avgScore}%
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${test.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{test.completionRate}%</span>
                          </td>
                          <td className="p-4">
                            <button 
                              className="mr-2 p-1 border rounded hover:bg-gray-100"
                              onClick={() => handleTestSelect(test)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 border rounded hover:bg-gray-100">
                              <Download className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'recent' && (
          <div className="bg-white p-4 rounded-lg shadow text-center">
            Recent tests tab content
          </div>
        )}
        
        {activeTab === 'scores' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Student Scores Across All Tests</h3>
              <button 
                onClick={() => setScoresSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50"
              >
                <ArrowUpDown className="h-4 w-4" />
                {scoresSortOrder === 'desc' ? 'Highest First' : 'Lowest First'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-medium text-gray-500">Student Name</th>
                    <th className="p-4 text-left font-medium text-gray-500">Test</th>
                    <th className="p-4 text-left font-medium text-gray-500">Subject</th>
                    <th className="p-4 text-left font-medium text-gray-500">Score</th>
                    <th className="p-4 text-left font-medium text-gray-500">Time Taken</th>
                    <th className="p-4 text-left font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="p-4 text-center">Loading scores...</td>
                    </tr>
                  ) : (
                    tests
                      .flatMap(test => 
                        test.students.map(student => ({
                          ...student,
                          testName: test.name,
                          subject: test.subject,
                          date: test.date
                        }))
                      )
                      .sort((a, b) => scoresSortOrder === 'desc' ? b.score - a.score : a.score - b.score)
                      .map((result, index) => (
                        <tr key={`${result.id}-${index}`} className="border-t hover:bg-gray-50">
                          <td className="p-4">{result.name}</td>
                          <td className="p-4">{result.testName}</td>
                          <td className="p-4">{result.subject}</td>
                          <td className="p-4">
                            <span className={`font-medium ${
                              result.score >= 80 ? 'text-green-600' : 
                              result.score >= 70 ? 'text-blue-600' : 
                              'text-orange-600'
                            }`}>
                              {result.score}%
                            </span>
                          </td>
                          <td className="p-4">{result.timeTaken} mins</td>
                          <td className="p-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              {result.status}
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Test Detail View */}
      {selectedTest && (
        <div className="bg-white rounded-lg shadow mt-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{selectedTest.name} - {selectedTest.subject}</h2>
            <button 
              className="px-3 py-1 border rounded hover:bg-gray-100"
              onClick={() => setSelectedTest(null)}
            >
              Close
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-500 text-sm">Date</p>
              <p className="font-medium">{new Date(selectedTest.date).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-500 text-sm">Students</p>
              <p className="font-medium">{selectedTest.studentsCount}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-500 text-sm">Average Score</p>
              <p className="font-medium">{selectedTest.avgScore}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-500 text-sm">Completion Rate</p>
              <p className="font-medium">{selectedTest.completionRate}%</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Score Distribution</h3>
              <div className="h-64 bg-white rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={generateScoreDistribution(selectedTest.students || [])}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value) => [`${value} students`, 'Count']}
                      labelStyle={{ color: '#666' }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Highest Score</span>
                    <span className="text-sm font-medium text-green-600">{selectedTest.highestScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${selectedTest.highestScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Average Score</span>
                    <span className="text-sm font-medium text-blue-600">{selectedTest.avgScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${selectedTest.avgScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Lowest Score</span>
                    <span className="text-sm font-medium text-orange-600">{selectedTest.lowestScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${selectedTest.lowestScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Student Results Table */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Student Results</h3>
            <p className="text-gray-500 mb-4">Showing top 5 students</p>
            
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3 font-medium text-gray-500">Student</th>
                  <th className="p-3 font-medium text-gray-500">Score</th>
                  <th className="p-3 font-medium text-gray-500">Time Taken</th>
                  <th className="p-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array(5).fill().map((_, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-3">Student {i + 1}</td>
                    <td className="p-3">{Math.floor(Math.random() * (100 - 60) + 60)}%</td>
                    <td className="p-3">{Math.floor(Math.random() * 60) + 10} mins</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-4 text-center">
              <button className="px-4 py-2 border rounded hover:bg-gray-100">
                View All Students
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherViewResults;