import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = '/api/exams';  // Using exam endpoints

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Utility function for error handling
const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  console.error('API Error:', errorMessage);
  throw { message: errorMessage, status: error.response?.status };
};

// Get teacher dashboard data by combining scheduled exams and results
export const getTeacherDashboard = async () => {
  try {
    const [scheduledExams, examResults] = await Promise.all([
      axiosInstance.get('/schedule'),
      axiosInstance.get('/results')
    ]);

    // Calculate dashboard statistics
    const activeTests = scheduledExams.data.filter(exam => exam.status === 'active').length;
    const pendingGrading = examResults.data.reduce((count, exam) => 
      count + (exam.submissions || []).filter(sub => sub.status === 'pending_grading').length, 0);

    // Get unique students
    const uniqueStudents = new Set();
    examResults.data.forEach(exam => {
      (exam.submissions || []).forEach(sub => {
        if (sub.student) {
          uniqueStudents.add(sub.student._id || sub.student);
        }
      });
    });

    // Get recent submissions
    const recentSubmissions = examResults.data
      .flatMap(exam => (exam.submissions || []).map(sub => ({
        id: sub._id || sub.id,
        title: exam.name || exam.title,
        subject: exam.subject,
        studentsCount: exam.submissions?.length || 0,
        score: sub.score,
        status: sub.status
      })))
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 5);

    return {
      totalStudents: uniqueStudents.size,
      activeTests,
      pendingGrading,
      recentSubmissions
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Get teacher's exam statistics
export const getTeacherStats = async () => {
  try {
    const response = await axiosInstance.get('/stats');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get recent exam results
export const getRecentResults = async () => {
  try {
    const response = await axiosInstance.get('/results');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};