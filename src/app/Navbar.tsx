import React from 'react';

const Navbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="navbar-wrapper">
      {children}
    </div>
  );
};

export default Navbar;