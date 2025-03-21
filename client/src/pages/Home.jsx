import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Sparkles, BookOpen, Shield, Brain, ArrowRight, ChevronRight } from 'lucide-react';

const Home = () => {
  console.log("Home component is rendering"); // Debug log

  const { isDarkMode } = useOutletContext();
  const [isHovered, setIsHovered] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-sky-100 to-blue-50'
    }`}>
      <main className="w-full">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center px-4">
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute inset-0 ${
              isDarkMode 
                ? 'bg-gradient-to-b from-transparent via-blue-900/30 to-gray-900/50' 
                : 'bg-gradient-to-b from-transparent via-white/30 to-sky-100/50'
            }`} />
          </div>

          <div className={`relative z-10 text-center max-w-4xl mx-auto transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              isDarkMode ? 'bg-white/10' : 'bg-white/60'
            }`}>
              <Sparkles className={`w-4 h-4 ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`} />
              <span className={isDarkMode ? 'text-white' : 'text-blue-900'}>
                Revolutionizing Online Education
              </span>
            </div>
            
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-blue-950'
            }`}>
              Master Your{' '}
              <span className={isDarkMode ? 'text-purple-300' : 'text-blue-600'}>
                Educational
              </span>{' '}
              Journey
            </h1>
            
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              isDarkMode ? 'text-white/80' : 'text-blue-900/80'
            }`}>
              Transform the way you conduct examinations with our intelligent and secure platform
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 ${
                isDarkMode 
                  ? 'bg-purple-500 hover:bg-purple-400 text-white' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}>
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </button>
              <button className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                isDarkMode 
                  ? 'border-2 border-white text-white hover:bg-white/10' 
                  : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
              }`}>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Floating cards in background with animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-1/4 -left-20 w-40 h-40 rounded-2xl transform rotate-12 animate-float-slow ${
              isDarkMode ? 'bg-purple-500/10' : 'bg-blue-500/10'
            }`} />
            <div className={`absolute bottom-1/4 -right-20 w-40 h-40 rounded-2xl transform -rotate-12 animate-float-delayed ${
              isDarkMode ? 'bg-purple-500/10' : 'bg-blue-500/10'
            }`} />
          </div>
        </section>

        {/* Features Grid with staggered animation */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<BookOpen className={`w-6 h-6 ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`} />}
              title="Adaptive Learning"
              description="AI-powered system that adjusts to each student's learning pace and style"
              isHovered={isHovered === 'adaptive'}
              setHovered={() => setIsHovered('adaptive')}
              setNotHovered={() => setIsHovered(null)}
              isDarkMode={isDarkMode}
              delay={0}
            />
            <FeatureCard 
              icon={<Shield className={`w-6 h-6 ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`} />}
              title="Advanced Security"
              description="Multi-layer protection with AI proctoring and encryption"
              isHovered={isHovered === 'security'}
              setHovered={() => setIsHovered('security')}
              setNotHovered={() => setIsHovered(null)}
              isDarkMode={isDarkMode}
              delay={0.2}
            />
            <FeatureCard 
              icon={<Brain className={`w-6 h-6 ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`} />}
              title="Smart Analytics"
              description="Detailed insights into performance metrics and learning patterns"
              isHovered={isHovered === 'analytics'}
              setHovered={() => setIsHovered('analytics')}
              setNotHovered={() => setIsHovered(null)}
              isDarkMode={isDarkMode}
              delay={0.4}
            />
          </div>
        </section>

        {/* CTA Section with animation */}
        <section className={`max-w-6xl mx-auto px-4 mb-20`}>
          <div className={`rounded-2xl p-12 text-center ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-900/50 to-violet-800/50 border border-white/10' 
              : 'bg-gradient-to-r from-blue-100 to-sky-200'
          }`}>
            <h2 className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-blue-950'
            }`}>
              Ready to Transform Your Institution?
            </h2>
            <p className={`mb-8 max-w-2xl mx-auto ${
              isDarkMode ? 'text-white/80' : 'text-blue-900/80'
            }`}>
              Join the educational revolution and provide your students with the best online examination experience
            </p>
            <button className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto ${
              isDarkMode 
                ? 'bg-purple-500 hover:bg-purple-400 text-white' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}>
              Get Started Now <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, isHovered, setHovered, setNotHovered, isDarkMode, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000); // Convert to milliseconds
    
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`backdrop-blur-lg rounded-xl p-6 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-white/5 border border-white/10' 
          : 'bg-white/60 border border-blue-200'
      } ${
        isHovered ? 'transform -translate-y-2 shadow-lg' : 'hover:transform hover:-translate-y-1 hover:shadow-md'
      } ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      onMouseEnter={setHovered}
      onMouseLeave={setNotHovered}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${
        isDarkMode ? 'bg-white/10' : 'bg-blue-100'
      }`}>
        {icon}
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${
        isDarkMode ? 'text-white' : 'text-blue-950'
      }`}>{title}</h3>
      <p className={isDarkMode ? 'text-white/70' : 'text-blue-900/70'}>{description}</p>
    </div>
  );
};

export default Home;