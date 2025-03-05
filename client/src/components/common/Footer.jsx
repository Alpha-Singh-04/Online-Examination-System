import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, Brain, Mail, Phone } from 'lucide-react';

const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`${
      isDarkMode 
        ? 'bg-gray-900/50 backdrop-blur-lg border-t border-white/10' 
        : 'bg-white/50 backdrop-blur-lg border-t border-blue-100'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-950'}`}>
              Online Exam System
            </h3>
            <p className={isDarkMode ? 'text-white/70' : 'text-blue-900/70'}>
              Transforming education through innovative examination solutions.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'linkedin'].map((social) => (
                <Link
                  key={social}
                  to="#"
                  className={`p-2 rounded-full transition-colors ${
                    isDarkMode 
                      ? 'bg-white/10 hover:bg-white/20 text-white' 
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-900'
                  }`}
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-blue-950'}`}>
              Features
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <BookOpen className={`w-4 h-4 ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`} />
                <span className={isDarkMode ? 'text-white/70' : 'text-blue-900/70'}>Adaptive Learning</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className={`w-4 h-4 ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`} />
                <span className={isDarkMode ? 'text-white/70' : 'text-blue-900/70'}>Advanced Security</span>
              </li>
              <li className="flex items-center space-x-2">
                <Brain className={`w-4 h-4 ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`} />
                <span className={isDarkMode ? 'text-white/70' : 'text-blue-900/70'}>Smart Analytics</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-blue-950'}`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={isDarkMode ? 'text-white/70 hover:text-white' : 'text-blue-900/70 hover:text-blue-900'}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className={isDarkMode ? 'text-white/70 hover:text-white' : 'text-blue-900/70 hover:text-blue-900'}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className={isDarkMode ? 'text-white/70 hover:text-white' : 'text-blue-900/70 hover:text-blue-900'}>
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-blue-950'}`}>
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className={`w-4 h-4 ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`} />
                <span className={isDarkMode ? 'text-white/70' : 'text-blue-900/70'}>support@examssystem.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className={`w-4 h-4 ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`} />
                <span className={isDarkMode ? 'text-white/70' : 'text-blue-900/70'}>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t ${isDarkMode ? 'border-white/10' : 'border-blue-100'} mt-8 pt-8`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={isDarkMode ? 'text-white/70' : 'text-blue-900/70'}>
              © 2025 Online Exam System. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <Link
                  key={item}
                  to="#"
                  className={isDarkMode ? 'text-white/70 hover:text-white' : 'text-blue-900/70 hover:text-blue-900'}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;