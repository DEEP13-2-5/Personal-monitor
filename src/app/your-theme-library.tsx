import React from 'react';

const YourThemeLibrary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="theme-wrapper">
      {children}
    </div>
  );
};

export default YourThemeLibrary;
