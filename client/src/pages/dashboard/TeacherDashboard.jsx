import { useState, useEffect } from 'react';
import { getTeacherDashboard } from '../../services/teacherService';

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
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await getTeacherDashboard();
        setData(response); // Direct use of response since API returns data in the correct format
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching teacher dashboard data:', error);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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
              {data.recentSubmissions.map((submission) => (
                <li key={submission.id} className="p-4 border-b last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{submission.title}</h4>
                      <p className="text-gray-600">{submission.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Students: {submission.studentsCount}</p>
                      <p className="text-sm">Score: {submission.score}</p>
                      <p className="text-sm">Status: {submission.status}</p>
                    </div>
                  </div>
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