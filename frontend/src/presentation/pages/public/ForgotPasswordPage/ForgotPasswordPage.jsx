import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import './ForgotPasswordPage.css';
const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('El correo es obligatorio');
      return false;
    }
    if (!emailRegex.test(email)) {
      setError('Ingresa un correo válido');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!validateEmail()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase()
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('✅ Correo enviado exitosamente. Revisa tu bandeja de entrada.');
        setEmail('');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Error al enviar el correo');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="forgot-password-page">
      <Header />
      <main className="forgot-password-main">
        <div className="forgot-password-container">
          {}
          <div className="back-link">
            <Link to="/login" className="back-button">
              ← Volver
            </Link>
          </div>
          {}
          <div className="forgot-password-card">
            <h1 className="forgot-password-title">¿Olvidaste tu contraseña?</h1>
            <form onSubmit={handleSubmit} className="forgot-password-form">
              {}
              {error && (
                <div className="error-message-box">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="success-message-box">
                  {successMessage}
                </div>
              )}
              {}
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Ingresa tu correo"
                  className={`form-input ${error ? 'error' : ''}`}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {}
              <button 
                type="submit" 
                className="btn-submit"
                disabled={isLoading || successMessage}
              >
                {isLoading ? 'Enviando...' : 'Recuperar cuenta'}
              </button>
            </form>
            {}
            <div className="info-message">
              <p>Te enviaremos un correo con un link de recuperación de tu cuenta.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default ForgotPasswordPage;
