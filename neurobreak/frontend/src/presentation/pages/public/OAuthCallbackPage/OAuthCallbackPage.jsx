// OAuth Callback Page - Maneja la redirección después de OAuth
// frontend/src/presentation/pages/public/OAuthCallbackPage/OAuthCallbackPage.jsx

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
      // Hubo un error en la autenticación OAuth
      console.error('Error en OAuth:', error);
      alert('Error al iniciar sesión con OAuth. Por favor intenta de nuevo.');
      navigate('/login');
      return;
    }

    if (token) {
      // Token recibido exitosamente
      try {
        // Decodificar el token para obtener info del usuario
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));

        // Guardar token en localStorage
        localStorage.setItem('token', token);

        // Obtener datos completos del usuario
        fetchUserData(token);

      } catch (error) {
        console.error('Error al procesar token:', error);
        alert('Error al procesar autenticación. Por favor intenta de nuevo.');
        navigate('/login');
      }
    } else {
      // No hay token ni error, redirigir al login
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
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirigir al dashboard
        navigate('/dashboard');
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