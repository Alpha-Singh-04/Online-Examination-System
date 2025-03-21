import { useState, useEffect } from 'react';
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';

const DashboardLayout = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false); // ✅ Add state for collapsed sidebar

  useEffect(() => {
    // Simulate loading state for smooth transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user is found, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header collapsed={collapsed} />
      <div className="flex flex-1">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
