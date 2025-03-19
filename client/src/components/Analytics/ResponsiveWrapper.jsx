// src/components/ResponsiveWrapper.jsx
import React from 'react';

const ResponsiveWrapper = ({ children, className }) => {
  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${className || ''}`}>
      {children}
    </div>
  );
};

export default ResponsiveWrapper;
