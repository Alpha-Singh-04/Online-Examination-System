import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Settings, HelpCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const NotificationDropdown = ({ isOpen, notifications, onClearNotifications }) => (
  isOpen && (
    <div 
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10" 
      role="menu" 
      aria-orientation="vertical"
    >
      <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        {notifications.length > 0 && (
          <button 
            onClick={onClearNotifications} 
            className="text-xs text-red-500 hover:text-red-700"
            aria-label="Clear all notifications"
          >
            Clear All
          </button>
        )}
      </div>
      {notifications.length > 0 ? (
        <div className="max-h-64 overflow-y-auto">
          {notifications.map((notification, index) => (
            <div 
              key={index} 
              className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
              role="menuitem"
            >
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
      ) : (
        <div 
          className="px-4 py-3 text-sm text-gray-500 text-center"
          role="menuitem"
        >
          No new notifications
        </div>
      )}
      <div className="px-4 py-2 text-center border-t border-gray-200">
        <button 
          className="text-xs text-indigo-600 hover:text-indigo-800"
          aria-label="View all notifications"
        >
          View all notifications
        </button>
      </div>
    </div>
  )
);

NotificationDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  notifications: PropTypes.array.isRequired,
  onClearNotifications: PropTypes.func.isRequired,
};

const ProfileDropdown = ({ isOpen, onLogout, userName }) => (
  isOpen && (
    <div 
      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10" 
      role="menu" 
      aria-orientation="vertical"
    >
      <div className="px-4 py-3 border-b border-gray-200">
        <p className="text-sm font-medium">{userName}</p>
        <p className="text-xs text-gray-500 mt-1">Student</p>
      </div>
      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        role="menuitem"
      >
        My Profile
      </button>
      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        role="menuitem"
      >
        Account Settings
      </button>
      <div className="border-t border-gray-200 mt-1"></div>
      <button
        onClick={onLogout}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
        role="menuitem"
      >
        Sign out
      </button>
    </div>
  )
);

ProfileDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

const Header = ({ collapsed }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [notifications, setNotifications] = useState([
    { title: 'New test scheduled: Mathematics', time: '10 minutes ago' },
    { title: 'Result published: Physics', time: '2 hours ago' },
    { title: 'Reminder: Chemistry test tomorrow', time: '5 hours ago' }
  ]);

  // Refs for dropdown containers
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Memoized time update function
  const updateTime = useCallback(() => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentTime(now.toLocaleDateString('en-US', options));
  }, []);
  
  // Enhanced useEffect for time update
  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, [updateTime]);

  // Improved outside click handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both dropdowns
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target) &&
        profileRef.current && 
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Memoized event handlers
  const handleLogout = useCallback(() => {
    // Add logout logic later
    navigate('/login');
  }, [navigate]);
  
  const toggleProfileDropdown = useCallback((e) => {
    e.stopPropagation();
    setIsProfileOpen(prev => !prev);
    setIsNotificationOpen(false);
  }, []);

  const toggleNotificationDropdown = useCallback((e) => {
    e.stopPropagation();
    setIsNotificationOpen(prev => !prev);
    setIsProfileOpen(false);
  }, []);

  // Clear notifications handler
  const handleClearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <header 
      className="bg-gradient-to-r from-blue-900 to-indigo-900 shadow-md sticky top-0 z-50" 
      role="banner"
    >
      <div className="px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div 
              className={`${
                collapsed 
                  ? 'ml-4' 
                  : 'ml-40'
              } hidden md:flex items-center bg-blue-800 bg-opacity-50 rounded-lg px-3 py-1.5 transition-all duration-300`}
            >
              <Search size={16} className="text-blue-300" />
              <input 
                type="text" 
                placeholder="Search..." 
                aria-label="Search"
                className="bg-transparent border-none text-sm text-white placeholder-blue-300 focus:outline-none ml-2 w-40"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-1 md:space-x-4">
            <div className="hidden md:block text-right mr-4">
              <p className="text-white text-sm font-medium">Welcome back!</p>
              <p className="text-blue-200 text-xs">{currentTime}</p>
            </div>
            
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotificationDropdown}
                className="p-1.5 rounded-full bg-blue-800 bg-opacity-50 text-white hover:bg-opacity-70 focus:outline-none"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span 
                    className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"
                    aria-label={`${notifications.length} unread notifications`}
                  ></span>
                )}
              </button>
              <NotificationDropdown 
                isOpen={isNotificationOpen} 
                notifications={notifications}
                onClearNotifications={handleClearNotifications}
              />
            </div>
            
            <button
              className="p-1.5 rounded-full bg-blue-800 bg-opacity-50 text-white hover:bg-opacity-70 focus:outline-none hidden md:block"
              aria-label="Help"
            >
              <HelpCircle size={18} />
            </button>
            
            <button
              className="p-1.5 rounded-full bg-blue-800 bg-opacity-50 text-white hover:bg-opacity-70 focus:outline-none hidden md:block"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
            
            <div className="relative ml-2" ref={profileRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm border-2 border-white">
                  JD
                </div>
              </button>
              <ProfileDropdown 
                isOpen={isProfileOpen} 
                onLogout={handleLogout}
                userName="John Doe"
              />  
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool
};

Header.defaultProps = {
  collapsed: false
};

export default Header;