import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Home, BookOpen, CheckSquare, BarChart2, User, Calendar, Settings, ChevronRight, HelpCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get user role from Redux

  // Sidebar collapsed state (persistent)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sidebar-collapsed')) || false;
    } catch {
      return false;
    }
  });

  const [expandedItem, setExpandedItem] = useState(null);

  // Toggle submenu expansion
  const toggleSubMenu = useCallback((name) => {
    setExpandedItem(prev => (prev === name ? null : name));
  }, []);

  // Toggle sidebar collapse
  const toggleCollapse = useCallback((e) => {
    e.stopPropagation();
    setCollapsed(prev => !prev);
  }, []);

  // Persist collapse state in localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // Role-based navigation items
  const navigationItems = useMemo(() => {
    if (!user) return []; // Ensure user exists

    if (user.role === "teacher") {
      return [
        { name: "Dashboard", path: "/teacher/dashboard", icon: Home },
        { name: "Create Test", path: "/teacher/create-test", icon: BookOpen },
        { name: "View Results", path: "/teacher/results", icon: BarChart2 },
        { name: "Schedule", path: "/teacher/schedule", icon: Calendar },
        { name: "Profile", path: "/teacher/profile", icon: User },
      ];
    } else if (user.role === "student") {
      return [
        { name: "Dashboard", path: "/student/dashboard", icon: Home },
        { name: "Take Test", path: "/student/take-test", icon: CheckSquare },
        { name: "My Results", path: "/student/results", icon: BarChart2 },
        { name: "My Learning", path: "#", icon: CheckSquare, subItems: [
          { name: "Courses", path: "/student/courses" },
          { name: "Progress", path: "/student/progress" },
          { name: "Resources", path: "/student/resources" }
        ]},
        { name: "Schedule", path: "/student/schedule", icon: Calendar },
        { name: "Profile", path: "/student/profile", icon: User },
      ];
    }
    return [];
  }, [user]);

  const secondaryNavItems = [
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
    { name: "Help & Support", path: "/dashboard/help", icon: HelpCircle },
  ];

  // Check if sub-item is active
  const isSubItemActive = useCallback((item) => {
    return item.subItems?.some(subItem => location.pathname === subItem.path);
  }, [location.pathname]);

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  }, [navigate]);

  return (
    <div className={`bg-gradient-to-b from-blue-900 to-indigo-900 min-h-screen transition-all duration-300 flex flex-col shadow-lg ${collapsed ? "w-16" : "w-64"}`}>
      
      {/* Sidebar Header */}
      <div className="px-4 py-6 flex items-center justify-center border-b border-blue-800">
        {!collapsed && <div className="text-white font-bold text-xl">ExamPortal</div>}
        <button onClick={toggleCollapse} className="absolute right-0 mr-2 bg-blue-800 rounded-full p-0.5 text-blue-300 hover:text-white">
          <ChevronRight size={16} className={`transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-800 scrollbar-track-transparent">
        <nav className="px-2 space-y-1">
          {navigationItems.map((item) => (
            <div key={item.name}>
              {item.subItems ? (
                <>
                  <button onClick={() => toggleSubMenu(item.name)}
                    className={`w-full group flex items-center px-3 py-2.5 rounded-lg mb-1 text-sm font-medium ${
                      isSubItemActive(item) ? 'bg-indigo-800 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                    }`}>
                    {collapsed ? (
                      <item.icon size={20} className={`${isSubItemActive(item) ? "text-white" : "text-blue-300 group-hover:text-white"}`} />
                    ) : (
                      <>
                        <item.icon size={20} className={`mr-3 ${isSubItemActive(item) ? "text-white" : "text-blue-300 group-hover:text-white"}`} />
                        <span className="flex-1 text-left">{item.name}</span>
                        <ChevronRight size={16} className={`transform transition-transform duration-150 ${expandedItem === item.name ? "rotate-90" : ""}`} />
                      </>
                    )}
                  </button>

                  {expandedItem === item.name && !collapsed && (
                    <div className="ml-8 space-y-1 mt-1">
                      {item.subItems.map((subItem) => (
                        <NavLink key={subItem.name} to={subItem.path} className={({ isActive }) =>
                          `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                            isActive ? "bg-indigo-700 text-white" : "text-blue-200 hover:bg-blue-800 hover:text-white"
                          }`}>
                          <span className="truncate">{subItem.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink to={item.path} className={({ isActive }) =>
                  `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg mb-1 ${
                    isActive ? "bg-indigo-700 text-white" : "text-blue-200 hover:bg-blue-800 hover:text-white"
                  }`}>
                  {collapsed ? <item.icon size={20} /> : <>
                    <item.icon size={20} className="mr-3" />
                    <span className="truncate">{item.name}</span>
                  </>}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Secondary Navigation */}
      <div className="p-2 border-t border-blue-800">
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => (
            <NavLink key={item.name} to={item.path} className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-xs font-medium rounded-md ${
                isActive ? "bg-indigo-800 text-white" : "text-blue-300 hover:bg-blue-800 hover:text-white"
              }`}>
              <item.icon size={16} className="mr-3" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}

          {/* Logout */}
          <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 text-xs font-medium text-blue-300 hover:text-white rounded-md hover:bg-blue-800">
            <LogOut size={16} className="mr-3" />
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>
      </div>

    </div>
  );
};

export default Sidebar;
