import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import './ResetPasswordPage.css';
const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isValidToken, setIsValidToken] = useState(true);
  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setServerError('Token de recuperación no válido');
    }
  }, [token]);
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
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Debe contener mayúsculas, minúsculas y números';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.password
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('✅ Contraseña actualizada exitosamente. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setServerError(data.message || 'Error al restablecer contraseña');
      }
    } catch (error) {
      console.error('Error:', error);
      setServerError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  if (!isValidToken) {
    return (
      <div className="reset-password-page">
        <Header />
        <main className="reset-password-main">
          <div className="reset-password-container">
            <div className="reset-password-card error-card">
              <h1 className="reset-password-title">⚠️ Token Inválido</h1>
              <p className="error-description">
                El link de recuperación no es válido o ha expirado.
              </p>
              <Link to="/forgot-password" className="btn-back">
                Solicitar nuevo link
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="reset-password-page">
      <Header />
      <main className="reset-password-main">
        <div className="reset-password-container">
          {}
          <div className="back-link">
            <Link to="/login" className="back-button">
              ← Volver al login
            </Link>
          </div>
          {}
          <div className="reset-password-card">
            <h1 className="reset-password-title">Restablecer Contraseña</h1>
            <p className="reset-description">
              Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.
            </p>
            <form onSubmit={handleSubmit} className="reset-password-form">
              {}
              {serverError && (
                <div className="error-message-box">
                  {serverError}
                </div>
              )}
              {successMessage && (
                <div className="success-message-box">
                  {successMessage}
                </div>
              )}
              {}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu nueva contraseña"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  disabled={isLoading || successMessage}
                  autoComplete="new-password"
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>
              {}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma tu nueva contraseña"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  disabled={isLoading || successMessage}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>
              {}
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bars">
                    <div className={`strength-bar ${formData.password.length >= 8 ? 'active' : ''}`}></div>
                    <div className={`strength-bar ${/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'active' : ''}`}></div>
                    <div className={`strength-bar ${/(?=.*\d)/.test(formData.password) ? 'active' : ''}`}></div>
                  </div>
                  <span className="strength-text">
                    {formData.password.length < 8 ? 'Débil' :
                     !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password) ? 'Media' : 'Fuerte'}
                  </span>
                </div>
              )}
              {}
              <button 
                type="submit" 
                className="btn-submit"
                disabled={isLoading || successMessage}
              >
                {isLoading ? 'Actualizando...' : 'Restablecer Contraseña'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
export default ResetPasswordPage;
