import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, Moon, Sun } from 'lucide-react';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <nav className={`fixed w-full z-50 ${
      isDarkMode 
        ? 'bg-gray-900/50 backdrop-blur-lg border-b border-white/10' 
        : 'bg-white/50 backdrop-blur-lg border-b border-blue-100'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-blue-950'
              }`}
            >
              Online Exam System
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'text-white/70 hover:text-white hover:bg-white/10' 
                  : 'text-blue-900/70 hover:text-blue-900 hover:bg-blue-100'
              }`}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-white/70 hover:text-white hover:bg-white/10' 
                    : 'text-blue-900/70 hover:text-blue-900 hover:bg-blue-100'
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md ${
                  isDarkMode 
                    ? 'bg-purple-500 hover:bg-purple-400 text-white' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                Login
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-900'
              }`}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-900'
              }`}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              className={`p-2 rounded-md ${
                isDarkMode 
                  ? 'text-white/70 hover:text-white hover:bg-white/10' 
                  : 'text-blue-900/70 hover:text-blue-900 hover:bg-blue-100'
              }`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;