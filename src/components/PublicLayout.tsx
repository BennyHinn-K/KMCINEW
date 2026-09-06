import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';

const PublicLayout = () => {
  return (
    <div
      data-theme="light"
      className="min-h-screen bg-background flex flex-col font-body text-ink antialiased"
    >
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
