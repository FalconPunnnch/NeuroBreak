import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from '../pages/public/WelcomePage/WelcomePage';
import LoginPage from '../pages/public/LoginPage/LoginPage';
import RegisterPage from '../pages/public/RegisterPage/RegisterPage';
import OAuthCallbackPage from '../pages/public/OAuthCallbackPage/OAuthCallbackPage';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from '../pages/public/ResetPasswordPage/ResetPasswordPage';
import ProfilePage from '../pages/student/ProfilePage/ProfilePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
