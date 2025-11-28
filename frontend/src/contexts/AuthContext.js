import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from 'core/services/AuthService';
import { roleStrategyFactory } from 'patterns/roles/RoleStrategyFactory';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for external auth changes (e.g. OAuth callback wrote token/user to localStorage)
  useEffect(() => {
    const onAuthChanged = () => {
      // Re-run checkAuth to refresh context from localStorage
      checkAuth();
    };
    window.addEventListener('auth:changed', onAuthChanged);
    return () => window.removeEventListener('auth:changed', onAuthChanged);
  }, []);
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        await logout();
      }
    }
    setLoading(false);
  };
  const login = async (email, password) => {
    try {
      const result = await AuthService.loginWithEmail(email, password);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        const redirectionData = roleStrategyFactory.getRedirectionData(result.user);
        return {
          success: true,
          user: result.user,
          redirectTo: redirectionData.path,
          message: redirectionData.message,
          type: redirectionData.type
        };
      }
      return { 
        success: false, 
        error: result.error 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error inesperado durante el login' 
      };
    }
  };
  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };
  const register = async (userData) => {
    try {
      const result = await AuthService.register(userData);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
