import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Logger } from '../lib/logger';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('kmci_admin_session') === 'true';
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      Logger.warn('Unauthorized access attempt', { path: location.pathname });
    } else {
      Logger.access('Admin route accessed', { path: location.pathname });
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
