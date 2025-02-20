import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileDropdown = ({ isOpen, onLogout }) => (
  isOpen && (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
      <button
        onClick={onLogout}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Sign out
      </button>
    </div>
  )
);

ProfileDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

const Header = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    // Add logout logic later
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold">Online Exam System</h1>
          
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span className="text-sm">John Doe</span>
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            </button>

            <ProfileDropdown isOpen={isProfileOpen} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;