import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import CreateTest from './pages/teacher/CreateTest';
import TakeTest from './pages/student/TakeTest';
import TestListPage from './pages/student/TestListPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import TestMonitor from './components/TestMonitor';
import ResultsDashboard from './pages/Results/ResultsDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import TeacherViewResult from './pages/teacher/TeacherViewResults';
import TeacherSchedule from './pages/teacher/TeacherSchedule';
import Profile from './pages/teacher/Profile';

// Roles
const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

// Function to handle redirection after login
const RedirectToDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  console.log('redux user',user);

  if (!user) return <Navigate to="/login" replace />;
  
  if (user.role === ROLES.ADMIN) {
    return <Navigate to="/" replace />;  // Redirect admin to Home page
  }

  switch (user.role) {
    case ROLES.TEACHER:
      return <Navigate to="/teacher/dashboard" replace />;
    case ROLES.STUDENT:
      return <Navigate to="/student/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route: Login */}
        <Route path="/login" element={<Login />} />

        {/* Wrap routes inside RootLayout correctly */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Redirect '/' to appropriate dashboard after authentication */}
        <Route path="/" element={<RedirectToDashboard />} />

        {/* Protected Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/teacher/dashboard" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="create-test" element={<CreateTest />} />
          <Route path="view-results" element={<TeacherViewResult />} />
          <Route path="schedule" element={<TeacherSchedule />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="take-test" element={<TestListPage />} />
          <Route path="take-test/:testId" element={<TakeTest />} />
          <Route path="take-monitor" element={<TestMonitor />} />
          <Route path="results" element={<ResultsDashboard />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
