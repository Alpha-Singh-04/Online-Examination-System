import { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [data, setData] = useState({
    totalTests: 0,
    completedTests: 0,
    averageScore: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/student/dashboard')
      .then(response => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching student dashboard data:', error);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Student Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Tests</h3>
          <p className="text-3xl font-bold">{data.totalTests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Completed Tests</h3>
          <p className="text-3xl font-bold">{data.completedTests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Average Score</h3>
          <p className="text-3xl font-bold">{data.averageScore}%</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="bg-white rounded-lg shadow">
          {data.recentActivity?.length > 0 ? (
            <ul>
              {data.recentActivity.map((activity, index) => (
                <li key={index} className="p-4 border-b last:border-b-0">
                  {activity}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No recent activity to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 