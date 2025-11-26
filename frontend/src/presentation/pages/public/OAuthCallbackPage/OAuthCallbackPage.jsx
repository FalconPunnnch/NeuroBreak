import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './OAuthCallbackPage.css';
const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    if (error) {
      console.error('Error en OAuth:', error);
      alert('Error al iniciar sesión con OAuth. Por favor intenta de nuevo.');
      navigate('/login');
      return;
    }
    if (token) {
      try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        localStorage.setItem('token', token);
        fetchUserData(token);
      } catch (error) {
        console.error('Error al procesar token:', error);
        alert('Error al procesar autenticación. Por favor intenta de nuevo.');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);
  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        const userRole = (data.user.rol || data.user.role || 'user').toLowerCase();
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error('No se pudo obtener datos del usuario');
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      alert('Error al completar autenticación. Por favor intenta de nuevo.');
      navigate('/login');
    }
  };
  return (
    <div className="oauth-callback-page">
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Completando autenticación...</p>
      </div>
    </div>
  );
};
export default OAuthCallbackPage;
