import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';

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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    else if (formData.password.length < 8) newErrors.password = 'Debe tener al menos 8 caracteres';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = 'Debe contener mayúsculas, minúsculas y números';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Las contraseñas no coinciden';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: formData.password })
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('✅ Contraseña actualizada exitosamente. Redirigiendo al login...');
        setTimeout(() => navigate('/login'), 2000);
      } else setServerError(data.message || 'Error al restablecer contraseña');
    } catch (error) {
      console.error(error);
      setServerError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div>
        <Header />
        <main className="container py-5">
          <div className="d-flex justify-content-center">
            <div className="card text-center p-4" style={{ maxWidth: '400px' }}>
              <h1 className="mb-3">⚠️ Token Inválido</h1>
              <p>El link de recuperación no es válido o ha expirado.</p>
              <Link to="/forgot-password" className="btn btn-warning mt-3 w-100">
                Solicitar nuevo link
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">

            <Link to="/login" className="d-inline-block mb-3 text-decoration-none text-white">
              ← Volver al login
            </Link>

            <div className="card p-4 shadow">
              <h1 className="text-center mb-3">Restablecer Contraseña</h1>
              <p className="text-center mb-4">
                Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.
              </p>

              {serverError && <div className="alert alert-danger">{serverError}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Nueva Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Ingresa tu nueva contraseña"
                    disabled={isLoading || successMessage}
                    autoComplete="new-password"
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Confirma tu nueva contraseña"
                    disabled={isLoading || successMessage}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                {/* Password strength */}
                {formData.password && (
                  <div className="mb-3 d-flex align-items-center gap-2">
                    <div className="d-flex flex-grow-1 gap-1">
                      <div className={`flex-grow-1 bg-light rounded` + (formData.password.length >= 8 ? ' bg-success' : '')} style={{height: '6px'}}></div>
                      <div className={`flex-grow-1 bg-light rounded` + (/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? ' bg-success' : '')} style={{height: '6px'}}></div>
                      <div className={`flex-grow-1 bg-light rounded` + (/(?=.*\d)/.test(formData.password) ? ' bg-success' : '')} style={{height: '6px'}}></div>
                    </div>
                    <span className="fw-bold">
                      {formData.password.length < 8 ? 'Débil' :
                       !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password) ? 'Media' : 'Fuerte'}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-warning w-100"
                  disabled={isLoading || successMessage}
                >
                  {isLoading ? 'Actualizando...' : 'Restablecer Contraseña'}
                </button>
              </form>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
