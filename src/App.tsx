import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';

// Lazy load pages for performance optimization
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Ministries = lazy(() => import('./pages/Ministries'));
const Contact = lazy(() => import('./pages/Contact'));
const Announcements = lazy(() => import('./pages/Announcements'));
const Donate = lazy(() => import('./pages/Donate'));
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const [loading, setLoading] = useState(!isAdminRoute);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence>
        {loading && <SplashScreen />}
      </AnimatePresence>
      
      {!loading && (
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            {/* Public Routes wrapped in Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/ministries" element={<Ministries />} />
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
        </Suspense>
      )}
    </Router>
  );
}

export default App;
