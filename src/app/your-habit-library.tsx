import React from 'react';

const YourHabitLibrary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="theme-wrapper">
      {children}
    </div>
  );
};

export default YourHabitLibrary;
