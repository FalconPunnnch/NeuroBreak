import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from 'components/layout/Header/Header';
import './RegisterPage.css';
const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Debe contener mayúsculas, minúsculas y números';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: 'student'
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('¡Registro exitoso! Bienvenido a NeuroBreak');
        navigate('/catalog');
      } else {
        setServerError(data.message || 'Error al registrarse');
      }
    } catch (error) {
      console.error('Error:', error);
      setServerError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/api/auth/google';
  };
  const handleMicrosoftLogin = () => {
    window.location.href = 'http://localhost:3001/api/auth/microsoft';
  };
  return (
    <div className="register-page">
      <Header />
      <main className="register-main">
        <div className="register-container">
          <div className="register-info">
            <h1 className="register-title">Realiza descansos según tu necesidad</h1>
            <div className="info-items">
              <div className="info-item">
                <div className="info-icon">🧠</div>
                <p className="info-text">
                  Mejora tu concentración y productividad con pausas inteligentes
                </p>
              </div>
              <div className="info-item">
                <div className="info-icon">⚡</div>
                <p className="info-text">
                  Reduce el estrés y aumenta tu energía con microactividades
                </p>
              </div>
              <div className="info-item">
                <div className="info-icon">🎯</div>
                <p className="info-text">
                  Alcanza tus metas académicas con un mejor balance
                </p>
              </div>
            </div>
          </div>
          <div className="register-form-wrapper">
            <div className="register-form-container">
              <div className="auth-tabs">
                <Link to="/register" className="auth-tab active">
                  Crear cuenta
                </Link>
                <Link to="/login" className="auth-tab">
                  Iniciar Sesión
                </Link>
              </div>
              <form onSubmit={handleSubmit} className="register-form">
                {serverError && (
                  <div className="error-message-box">
                    {serverError}
                  </div>
                )}
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre"
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <span className="error-text">{errors.firstName}</span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Ingresa tu apellido"
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <span className="error-text">{errors.lastName}</span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ingresa tu correo"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa una contraseña"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <span className="error-text">{errors.password}</span>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registrando...' : 'Registrarme'}
                </button>
                {}
                <div className="oauth-section">
                  <p className="oauth-text">o continúe con</p>
                  <div className="oauth-buttons">
                    {}
                    <button 
                      type="button" 
                      className="oauth-btn oauth-btn-active" 
                      onClick={handleGoogleLogin}
                      title="Continuar con Google"
                    >
                      <svg viewBox="0 0 24 24" width="28" height="28">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </button>
                    {}
                    <button 
                      type="button" 
                      className="oauth-btn oauth-btn-active" 
                      onClick={handleMicrosoftLogin}
                      title="Continuar con Microsoft"
                    >
                      <svg viewBox="0 0 24 24" width="28" height="28">
                        <path fill="#f25022" d="M1 1h10v10H1z"/>
                        <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                        <path fill="#7fba00" d="M1 13h10v10H1z"/>
                        <path fill="#ffb900" d="M13 13h10v10H13z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default RegisterPage;
