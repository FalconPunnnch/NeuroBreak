import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  requiredAuth = false,
  fallbackPath = '/login',
  allowedRoles = []
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando autenticación...</span>
        </div>
      </div>
    );
  }
  if (requiredAuth && (!isAuthenticated || !user)) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }
  if (!isAuthenticated || !user) {
    return children;
  }
  if (requiredRole) {
    const userRole = user.rol || user.role || 'user';
    if (userRole.toLowerCase() !== requiredRole.toLowerCase()) {
      const redirectPath = userRole.toLowerCase() === 'admin' ? '/admin/dashboard' : '/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }
  if (allowedRoles.length > 0) {
    const userRole = (user.rol || user.role || 'user').toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
    if (!normalizedAllowedRoles.includes(userRole)) {
      if (userRole === 'admin' && location.pathname === '/dashboard') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }
  return children;
};
export default ProtectedRoute;
