import React, { useState, useEffect } from 'react';
import { CameraIcon, ClockIcon } from 'lucide-react';
import axios from 'axios';

import { getPlaceholderImage } from '../../services/placeholderService';
import { getToken, isAuthenticated, removeToken } from '../../utils/auth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfilePicture, updateProfileName } from '../../redux/features/profileSlice';


// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to automatically add token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      console.log('Token found in interceptor:', token);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found in interceptor');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.data);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    examRole: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [userStats, setUserStats] = useState({
    totalExamsTaken: 8,
    averageScore: 85.5,
    totalCertificates: 3,
    performanceProgress: 72
  });


  const [error, setError] = useState(null);

  // Add loading state
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch user profile data when component mounts
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name,
        email: profile.email
      }));
    }
  }, [profile]);
  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
  
    if (!isAuthenticated()) {
      setError('Please login to upload a profile picture');
      return;
    }
    if (!file) {
      setError("No file selected");
      return;
    }
  
    try {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result;
  
        console.log("Uploading Base64:", base64String.slice(0, 50));
  
        try {
          const response = await updateProfilePicture(base64String);
          console.log("Response:", response);
  
          if (response.profilePicture) {
            console.log('Dispatching updateProfilePicture with payload:', response.profilePicture);
            dispatch(updateProfilePicture(response.profilePicture)); // Update Redux profile state
          } else {
            setError("Failed to update profile picture.");
          }
        } catch (error) {
          console.error("Upload error:", error);
          setError("Failed to upload profile picture.");
        }
      };
    } catch (error) {
      console.error("Error processing file:", error);
      setError("Unexpected error occurred.");
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAuthenticated()) {
        setError('Please login to update profile');
        return;
      }
  
      const response = await api.put('/api/auth/profile', {
        name: formData.name,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
  
      // Update Redux store
      dispatch(updateProfileName(response.data.name));
  
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
  
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };
  

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-avatar.png";
    return imagePath.startsWith("data:image")
      ? imagePath
      : `data:image/png;base64,${imagePath}`;
  };
  
  
  

  const renderProfileImageUploader = () => (
    <div className="relative group">
      <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
        <img 
          src={getImageUrl(profile?.profilePicture)} 
          alt="Profile" 
          className={`w-full h-full object-cover group-hover:opacity-70 transition-all duration-300 ${
            isUploading ? 'opacity-50' : ''
          }`}
        />
        {isEditing && (
          <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <CameraIcon className="text-white bg-black/50 rounded-full p-2" size={40} />
            )}
          </label>
        )}
      </div>
    </div>
  );

  const renderPerformanceOverview = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <ClockIcon className="text-indigo-600" />
          <h3 className="text-lg font-semibold">Performance Overview</h3>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Overall Progress</p>
            <p className="text-2xl font-bold text-indigo-600">
              {userStats.performanceProgress}%
            </p>
          </div>
          <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{width: `${userStats.performanceProgress}%`}}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Exams</p>
            <p className="text-xl font-bold">{userStats.totalExamsTaken}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Avg. Score</p>
            <p className="text-xl font-bold text-green-600">{userStats.averageScore}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Certificates</p>
            <p className="text-xl font-bold text-blue-600">{userStats.totalCertificates}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {error && (
        <div className="max-w-6xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Details Column */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center space-x-6 mb-6">
              {renderProfileImageUploader()}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                <p className="text-gray-600">{profile?.email}</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                />
              </div>

              {isEditing && (
                <>
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Performance and Statistics Column */}
        <div>
          {renderPerformanceOverview()}
        </div>
      </div>
    </div>
  );
};

export default Profile;