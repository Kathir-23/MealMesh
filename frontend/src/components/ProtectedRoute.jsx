import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verify if user exists and has necessary properties
    if (user && user.id && user.token && user.type) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsVerifying(false);
  }, [user]);

  if (isVerifying) {
    // Show a loading state while verifying
    return <div className="flex items-center justify-center h-screen">Verifying authentication...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to={`/auth/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Make sure correct dashboard type is accessed
  const isDonorPath = location.pathname === '/donor/dashboard';
  const isOrgPath = location.pathname === '/organization/dashboard';
  
  if ((isDonorPath && user.type !== 'donor') || (isOrgPath && user.type !== 'organization')) {
    // Redirect to the correct dashboard
    return <Navigate to={`/${user.type}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;