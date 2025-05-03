import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Dashboard: React.FC = () => {
  return (
    <>
      <Navbar>
        <div>Navigation Content</div>
      </Navbar>
      <h1>Hello</h1>
      <Footer>
        <div>Footer Content</div>
      </Footer>
    </>
  );
};

export default Dashboard;
