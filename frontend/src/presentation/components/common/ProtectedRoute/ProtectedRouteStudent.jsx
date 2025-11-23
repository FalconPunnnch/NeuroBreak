import React from 'react';
import ProtectedRoute from './ProtectedRoute';
const ProtectedRouteStudent = ({ children }) => {
  return (
    <ProtectedRoute
      allowedRoles={["user", "student"]}
      fallbackPath="/login"
    >
      {children}
    </ProtectedRoute>
  );
};
export default ProtectedRouteStudent;
