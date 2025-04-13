import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = '/api/exams';

// Get token using auth utility
export const getAuthToken = () => {
  return getToken();
};

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
    const token = getAuthToken();
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

// Validate exam data before sending to API
const validateExamData = (examData) => {
  const requiredFields = ['title', 'subject', 'duration', 'startTime', 'endTime'];
  const missingFields = requiredFields.filter(field => !examData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate date and time
  const startTime = new Date(examData.startTime);
  const endTime = new Date(examData.endTime);
  if (endTime <= startTime) {
    throw new Error('End time must be after start time');
  }

  // Validate duration
  if (examData.duration <= 0) {
    throw new Error('Duration must be greater than 0');
  }

  return true;
};

// Create a new exam
export const createExam = async (examData) => {
  try {
    validateExamData(examData);
    const response = await axiosInstance.post('/create', examData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get exam results for teacher
export const getExamResults = async () => {
  try {
    const response = await axiosInstance.get('/results');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get detailed results for a specific exam
export const getExamDetailedResults = async (examId) => {
  try {
    if (!examId) throw new Error('Exam ID is required');
    const response = await axiosInstance.get(`/results/${examId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get all scheduled exams for a teacher
export const getScheduledExams = async () => {
  try {
    const response = await axiosInstance.get('/schedule');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Schedule a new exam
export const scheduleExam = async (examData) => {
  try {
    validateExamData(examData);
    const response = await axiosInstance.post('/schedule', examData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update a scheduled exam
export const updateScheduledExam = async (examId, examData) => {
  try {
    if (!examId) throw new Error('Exam ID is required');
    validateExamData(examData);
    const response = await axiosInstance.put(`/schedule/${examId}`, examData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete a scheduled exam
export const deleteScheduledExam = async (examId) => {
  try {
    if (!examId) throw new Error('Exam ID is required');
    const response = await axiosInstance.delete(`/schedule/${examId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}; 