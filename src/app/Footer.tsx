import React from 'react';

const Footer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="footer-wrapper">
      {children}
    </div>
  );
};

export default Footer;