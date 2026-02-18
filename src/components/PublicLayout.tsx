import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default PublicLayout;
