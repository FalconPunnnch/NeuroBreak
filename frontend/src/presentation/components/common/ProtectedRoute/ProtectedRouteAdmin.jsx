import React from 'react';
import ProtectedRoute from './ProtectedRoute';
const ProtectedRouteAdmin = ({ children }) => {
  return (
    <ProtectedRoute
      requiredRole="admin"
      fallbackPath="/catalog"
    >
      {children}
    </ProtectedRoute>
  );
};
export default ProtectedRouteAdmin;
