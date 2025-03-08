import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, BarChart2, User, Calendar, Settings, ChevronRight, HelpCircle, LogOut } from 'lucide-react';
import PropTypes from 'prop-types';
import Header from './Header';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Tests', path: '/dashboard/tests', icon: BookOpen },
  { name: 'Results', path: '/dashboard/results', icon: BarChart2 },
  { 
    name: 'My Learning', 
    path: '#', 
    icon: CheckSquare,
    subItems: [
      { name: 'Courses', path: '/dashboard/courses' },
      { name: 'Progress', path: '/dashboard/progress' },
      { name: 'Resources', path: '/dashboard/resources' }
    ]
  },
  { name: 'Schedule', path: '/dashboard/schedule', icon: Calendar },
  { name: 'Profile', path: '/dashboard/profile', icon: User },
];

const secondaryNavItems = [
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  { name: 'Help & Support', path: '/dashboard/help', icon: HelpCircle },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Persist sidebar state in localStorage
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const savedState = localStorage.getItem('sidebar-collapsed');
      return savedState !== null ? JSON.parse(savedState) : false;
    } catch (error) {
      console.error('Error reading sidebar state from localStorage:', error);
      return false;
    }
  });

  const [expandedItem, setExpandedItem] = useState(null);

  // Memoized toggle functions
  const toggleSubMenu = useCallback((name) => {
    setExpandedItem(prev => prev === name ? null : name);
  }, []);

  const toggleCollapse = useCallback((e) => {
    e.stopPropagation();
    setCollapsed(prev => !prev);
  }, []);

  // Persist collapsed state in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
    } catch (error) {
      console.error('Error saving sidebar state to localStorage:', error);
    }
  }, [collapsed]);

  // Memoized active state checkers
  const isSubItemActive = useCallback((item) => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => location.pathname === subItem.path);
  }, [location.pathname]);

  // Logout handler
  const handleLogout = useCallback(() => {
    // Add logout logic (e.g., clear tokens, reset session)
    try {
      // Example: Clear authentication token
      localStorage.removeItem('auth_token');
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [navigate]);

  // Memoized navigation items rendering
  const renderNavigationItems = useMemo(() => 
    navigationItems.map((item) => (
      <div key={item.name}>
        {item.subItems ? (
          <>
            <button
              onClick={() => toggleSubMenu(item.name)}
              className={`w-full group flex items-center px-3 py-2.5 rounded-lg mb-1 text-sm font-medium ${
                isSubItemActive(item)
                  ? 'bg-indigo-800 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              {collapsed ? (
                <item.icon 
                  size={20} 
                  className={`${
                    isSubItemActive(item) ? 'text-white' : 'text-blue-300 group-hover:text-white'
                  }`} 
                />
              ) : (
                <>
                  <item.icon 
                    size={20} 
                    className={`mr-3 ${
                      isSubItemActive(item) ? 'text-white' : 'text-blue-300 group-hover:text-white'
                    }`} 
                  />
                  <span className="flex-1 text-left">{item.name}</span>
                  <ChevronRight 
                    size={16} 
                    className={`transform transition-transform duration-150 ${expandedItem === item.name ? 'rotate-90' : ''}`} 
                  />
                </>
              )}
            </button>
            {expandedItem === item.name && !collapsed && (
              <div className="ml-8 space-y-1 mt-1">
                {item.subItems.map((subItem) => (
                  <NavLink
                    key={subItem.name}
                    to={subItem.path}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-indigo-700 text-white'
                          : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="truncate">{subItem.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg mb-1 ${
                isActive
                  ? 'bg-indigo-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            {collapsed ? (
              <item.icon size={20} />
            ) : (
              <>
                <item.icon size={20} className="mr-3" />
                <span className="truncate">{item.name}</span>
              </>
            )}
          </NavLink>
        )}
      </div>
    )), 
    [collapsed, expandedItem, location.pathname, toggleSubMenu, isSubItemActive]
  );

  return (
    <div 
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-gradient-to-b from-blue-900 to-indigo-900 min-h-screen transition-all duration-300 flex flex-col shadow-lg`}
    >
      <div className="px-4 py-6 flex items-center justify-center border-b border-blue-800">
        {!collapsed && (
          <div className="text-white font-bold text-xl">ExamPortal</div>
        )}
        <button 
          onClick={toggleCollapse}
          className="absolute right-0 mr-2 bg-blue-800 rounded-full p-0.5 text-blue-300 hover:text-white"
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronRight size={16} className={`transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-800 scrollbar-track-transparent">
        <nav className="px-2 space-y-1">
          {renderNavigationItems}
        </nav>
      </div>
      
      <div className="p-2 border-t border-blue-800">
        <nav className="space-y-1">
          {!collapsed && secondaryNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-xs font-medium rounded-md ${
                  isActive
                    ? 'bg-indigo-800 text-white'
                    : 'text-blue-300 hover:bg-blue-800 hover:text-white'
                }`
              }
            >
              <item.icon size={16} className="mr-3" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
          
          {collapsed && secondaryNavItems.map((item) => (
            <div key={item.name} className="flex justify-center my-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `p-1.5 rounded-md ${
                    isActive
                      ? 'bg-indigo-800 text-white'
                      : 'text-blue-300 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={16} />
              </NavLink>
            </div>
          ))}
          
          <div className={`${collapsed ? 'flex justify-center mt-3' : 'px-3 py-2 mt-3'}`}>
            <button 
              onClick={handleLogout}
              className={`${
                collapsed 
                  ? 'text-blue-300 hover:text-white p-1.5 rounded-md hover:bg-blue-800' 
                  : 'flex items-center text-xs font-medium text-blue-300 hover:text-white rounded-md w-full px-3 py-2 hover:bg-blue-800'
              }`}
              aria-label="Logout"
            >
              {collapsed ? (
                <LogOut size={16} />
              ) : (
                <>
                  <LogOut size={16} className="mr-3" />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </nav>
      </div>
      {/* <Header collapsed={collapsed} /> */}
    </div>
  );
};

Sidebar.propTypes = {
  navigationItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      subItems: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
        })
      ),
    })
  ),
};

export default Sidebar;