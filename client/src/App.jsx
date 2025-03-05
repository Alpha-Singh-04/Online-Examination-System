
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import Header from './components/dashboard/Header';
import Sidebar from './components/dashboard/Sidebar';
// import Navbar from './components/common/NavBar ';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
        
        <Route path="/login" element={<Login />} />
        
        
        //? to check the components only
        {/* <Route path="/register" element={<Register />} />
        <Route path="/header" element={<Header />} />
        <Route path="/sidebar" element={<Sidebar />} /> */}
        {/* <Route path="/navbar" element={<Navbar />} /> */}

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