import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      <Navbar />
      {/* Added pt-24 to prevent content overlap with fixed navbar */}
      <main className="flex-grow pt-24">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default PublicLayout;
