import { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDashboard = () => {
  const [data, setData] = useState({
    totalStudents: 0,
    activeTests: 0,
    pendingGrading: 0,
    recentSubmissions: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/teacher/dashboard')
      .then(response => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teacher dashboard data:', error);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Teacher Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Students</h3>
          <p className="text-3xl font-bold">{data.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Active Tests</h3>
          <p className="text-3xl font-bold">{data.activeTests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Pending Grading</h3>
          <p className="text-3xl font-bold">{data.pendingGrading}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Submissions</h3>
        <div className="bg-white rounded-lg shadow">
          {data.recentSubmissions?.length > 0 ? (
            <ul>
              {data.recentSubmissions.map((submission, index) => (
                <li key={index} className="p-4 border-b last:border-b-0">
                  {submission}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No recent submissions to review
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;