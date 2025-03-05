import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PropTypes from 'prop-types';

const RootLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <div 
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-violet-900' 
          : 'bg-gradient-to-br from-blue-50 via-sky-100 to-blue-50'
      } ${mounted ? 'opacity-100' : 'opacity-0'}`}
    >
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
          100% { transform: translateY(0px) rotate(12deg); }
        }
        
        @keyframes floatDelayed {
          0% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-15px) rotate(-12deg); }
          100% { transform: translateY(0px) rotate(-12deg); }
        }
        
        .animate-float-slow {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: floatDelayed 7s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow">
        <Outlet context={{ isDarkMode }} />
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

RootLayout.propTypes = {
  children: PropTypes.node,
};

export default RootLayout;