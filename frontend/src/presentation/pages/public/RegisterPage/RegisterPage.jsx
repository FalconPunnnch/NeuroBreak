import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) newErrors.email = 'Correo inválido';
    if (!formData.password || formData.password.length < 8)
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      } else setServerError(data.message || 'Error al registrarse');
    } catch (error) {
      console.error('Error:', error);
      setServerError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => window.location.href = 'http://localhost:3001/api/auth/google';
  const handleMicrosoftLogin = () => window.location.href = 'http://localhost:3001/api/auth/microsoft';

  return (
    <div className="auth-page bg-dark text-light min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="fw-bold mb-4 display-5">Realiza descansos según tu necesidad</h1>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-3">
                  <span className="fs-1">🧠</span>
                  <p className="mb-0 fs-5">Mejora tu concentración y productividad con pausas inteligentes</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fs-1">⚡</span>
                  <p className="mb-0 fs-5">Reduce el estrés y aumenta tu energía con microactividades</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fs-1">🎯</span>
                  <p className="mb-0 fs-5">Alcanza tus metas académicas con un mejor balance</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card bg-light shadow-lg border-0 rounded-4">
                <div className="card-body p-4 p-md-5">
                  <div className="d-flex justify-content-center border-bottom pb-3 mb-4">
                    <Link to="/register" className="fw-bold text-dark me-4 text-decoration-none border-bottom border-3 border-warning">
                      Crear cuenta
                    </Link>
                    <Link to="/login" className="text-muted text-decoration-none">Iniciar Sesión</Link>
                  </div>

                  {serverError && <div className="alert alert-danger text-center">{serverError}</div>}

                  {/* FORM */}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        placeholder="Ingresa tu nombre"
                        disabled={isLoading}
                      />
                      {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        placeholder="Ingresa tu apellido"
                        disabled={isLoading}
                      />
                      {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>

                    <div className="mb-3">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Ingresa tu correo"
                        disabled={isLoading}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-4">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Ingresa una contraseña"
                        disabled={isLoading}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <button type="submit" className="btn btn-warning w-100 fw-bold py-2 mb-3" disabled={isLoading}>
                      {isLoading ? 'Registrando...' : 'Registrarme'}
                    </button>

                    <div className="text-center mt-3">
                      <p className="text-muted mb-3">o continúe con</p>
                      <div className="d-flex justify-content-center gap-3">
                        <button type="button" className="btn btn-outline-light bg-white rounded-circle p-2" onClick={handleGoogleLogin}>
                          <i className="fab fa-google fa-lg text-danger"></i>
                        </button>
                        <button type="button" className="btn btn-outline-light bg-white rounded-circle p-2" onClick={handleMicrosoftLogin}>
                          <i className="fab fa-windows fa-lg text-primary"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
