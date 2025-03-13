
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';

import CreateTest from './pages/teacher/CreateTest';
import TakeTest from './pages/student/TakeTest';
import AdminDashboard from './pages/dashboard/AdminDashboard';

/*
import Register from './pages/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/dashboard/Header';
import Sidebar from './components/dashboard/Sidebar';
*/

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
        
        <Route path="/login" element={<Login />} />
        
        <Route path='/createTest' element={<CreateTest />} />
        <Route path='/takeTest' element={<TakeTest />} />
        <Route path='/adminDashboard' element={<AdminDashboard />} />

        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
            //   <DashboardLayout />
            // </ProtectedRoute>
            <DashboardLayout/>
          }
        >
          <Route index element={<Dashboard />} />
          {/* Add more dashboard routes later */}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;