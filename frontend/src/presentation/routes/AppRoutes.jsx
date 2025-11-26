import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from '../pages/public/WelcomePage/WelcomePage';
import LoginPage from '../pages/public/LoginPage/LoginPage';
import RegisterPage from '../pages/public/RegisterPage/RegisterPage';
import OAuthCallbackPage from '../pages/public/OAuthCallbackPage/OAuthCallbackPage';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from '../pages/public/ResetPasswordPage/ResetPasswordPage';
import ProfilePage from '../pages/student/ProfilePage/ProfilePage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage/AdminDashboardPage';
import StudentDashboardPage from '../pages/student/StudentDashboardPage/StudentDashboardPage';
import CatalogPage from '../pages/student/CatalogPage/CatalogPage';
import MicroactivityDetailPage from '../pages/student/MicroactivityDetailPage/MicroactivityDetailPage';
import ActivityRunnerPage from '../pages/student/ActivityRunnerPage/ActivityRunnerPage';
import TimerPage from '../pages/student/TimerPage/TimerPage';
import ProtectedRoute from '../components/common/ProtectedRoute/ProtectedRoute';
import ProtectedRouteAdmin from '../components/common/ProtectedRoute/ProtectedRouteAdmin';
import ProtectedRouteStudent from '../components/common/ProtectedRoute/ProtectedRouteStudent';
import PublicRoute from '../components/common/ProtectedRoute/PublicRoute';
const AppRoutes = () => {
  return (
    <Routes>
      {}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />
      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPasswordPage />
        </PublicRoute>
      } />
      <Route path="/reset-password/:token" element={
        <PublicRoute>
          <ResetPasswordPage />
        </PublicRoute>
      } />
      {}
      <Route path="/profile" element={
        <ProtectedRoute requiredAuth={true}>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/catalog" element={
        <ProtectedRoute requiredAuth={true}>
          <CatalogPage />
        </ProtectedRoute>
      } />
      <Route path="/catalog/:id" element={
        <ProtectedRoute requiredAuth={true}>
          <MicroactivityDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/actividad/:id" element={
        <ProtectedRoute requiredAuth={true}>
          <ActivityRunnerPage />
        </ProtectedRoute>
      } />
      <Route path="/timer" element={
        <ProtectedRoute requiredAuth={true}>
          <TimerPage />
        </ProtectedRoute>
      } />
      {}
      <Route path="/student/dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute 
          allowedRoles={["user", "student"]}
          fallbackPath="/login"
        >
          <StudentDashboardPage />
        </ProtectedRoute>
      } />
      {}
      <Route path="/admin/dashboard" element={
        <ProtectedRouteAdmin>
          <AdminDashboardPage />
        </ProtectedRouteAdmin>
      } />
      {}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRoutes;
