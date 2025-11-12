// HU04 - Forgot Password Page
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/layout/Header/Header";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError("El correo es obligatorio");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Ingresa un correo válido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("✅ Correo enviado exitosamente. Revisa tu bandeja de entrada.");
        setEmail("");
        setTimeout(() => navigate("/login"), 3000);
      } else setError(data.message || "Error al enviar el correo");
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="card auth-card shadow-lg border-0 rounded-4 p-4 p-md-5">
          <div className="mb-3">
            <Link to="/login" className="text-dark text-decoration-none fw-semibold d-inline-flex align-items-center">
              <i className="fa-solid fa-arrow-left me-2"></i> Volver
            </Link>
          </div>

          <h2 className="text-center fw-bold mb-4">¿Olvidaste tu contraseña?</h2>

          {error && <div className="alert alert-danger text-center">{error}</div>}
          {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className={`form-control ${error ? "is-invalid" : ""}`}
                placeholder="Ingresa tu correo"
                disabled={isLoading}
                autoComplete="email"
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100 fw-bold py-2 mb-3"
              disabled={isLoading || successMessage}
            >
              {isLoading ? "Enviando..." : "Recuperar cuenta"}
            </button>
          </form>

          <div className="text-center border-top pt-3 mt-3">
            <p className="text-muted mb-0">
              Te enviaremos un correo con un link de recuperación de tu cuenta.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
