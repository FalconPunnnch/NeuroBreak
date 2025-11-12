import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/layout/Header/Header";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginPage.css"; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email))
      newErrors.email = "Correo inválido";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert(`¡Bienvenido, ${data.user.firstName}!`);
        navigate("/catalog");
      } else setServerError(data.message || "Credenciales inválidas");
    } catch {
      setServerError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = () => (window.location.href = "http://localhost:3001/api/auth/google");
  const handleMicrosoft = () => (window.location.href = "http://localhost:3001/api/auth/microsoft");

  return (
    <div className="auth-page bg-dark text-light min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* Información lateral */}
            <div className="col-lg-6 text-center text-lg-start d-none d-lg-block">
              <h1 className="fw-bold mb-4 display-5">Bienvenido de nuevo</h1>
              <p className="fs-5">
                Inicia sesión para continuar mejorando tu concentración y aprovechar tus pausas inteligentes.
              </p>
            </div>

            {/* Formulario */}
            <div className="col-lg-6">
              <div className="card bg-light shadow-lg border-0 rounded-4">
                <div className="card-body p-4 p-md-5">
                  <div className="d-flex justify-content-center border-bottom pb-3 mb-4">
                    <Link to="/register" className="text-muted text-decoration-none me-4">
                      Crear cuenta
                    </Link>
                    <Link
                      to="/login"
                      className="fw-bold text-dark text-decoration-none border-bottom border-3 border-warning"
                    >
                      Iniciar Sesión
                    </Link>
                  </div>

                  {serverError && <div className="alert alert-danger text-center">{serverError}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        placeholder="Ingresa tu correo"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                      <input
                        type="password"
                        name="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        placeholder="Ingresa tu contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <div className="text-end mb-3">
                      <Link to="/forgot-password" className="small text-dark text-decoration-none">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>

                    <button type="submit" className="btn btn-warning w-100 fw-bold py-2 mb-3" disabled={isLoading}>
                      {isLoading ? "Ingresando..." : "Ingresar"}
                    </button>

                    <div className="text-center mt-3">
                      <p className="text-muted mb-3">o continúa con</p>
                      <div className="d-flex justify-content-center gap-3">
                        <button
                          type="button"
                          className="btn btn-outline-light bg-white rounded-circle p-3"
                          onClick={handleGoogle}
                        >
                          <i className="fab fa-google fa-lg text-danger"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-light bg-white rounded-circle p-3"
                          onClick={handleMicrosoft}
                        >
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

export default LoginPage;
