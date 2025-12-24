import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Ministries from './pages/Ministries';
import Sermons from './pages/Sermons';
import Contact from './pages/Contact';
import Announcements from './pages/Announcements';
import Donate from './pages/Donate';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence>
        {loading && <SplashScreen />}
      </AnimatePresence>
      
      {!loading && (
        <Routes>
          {/* Public Routes wrapped in Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/ministries" element={<Ministries />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Admin Routes (No Public Navbar/Footer) */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <AdminDashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect /admin to /admin/dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Catch all - 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
