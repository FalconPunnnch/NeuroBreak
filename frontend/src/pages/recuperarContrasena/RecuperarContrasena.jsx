import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecuperarContrasena.css";
import Header from "../../components/header/Header";

const RecuperarContrasena = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!correo) {
      alert("Por favor ingresa tu correo electrónico");
      return;
    }

    // Simulación de envío de correo
    console.log("Recuperar contraseña para:", correo);
    setMensaje("Te hemos enviado un correo con las instrucciones para recuperar tu cuenta.");

    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <div className="recuperar-page bg-dark-blue text-white d-flex flex-column min-vh-100">
      <Header />

      <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5 position-relative">
        {/* Botón Volver */}
        <button className="btn btn-link text-white volver-btn" onClick={() => navigate("/login")}>
          ← Volver
        </button>

        {/* Caja de recuperación */}
        <div className="bg-light-blue rounded-4 p-5 shadow recuperar-box text-center">
          <h2 className="fw-semibold mb-4 position-relative recuperar-titulo">
            ¿Olvidaste tu contraseña?
          </h2>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 mt-4">
            <input
              type="email"
              className="form-control rounded-4 p-3"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

            <button type="submit" className="btn btn-warning text-white fw-semibold rounded-4 py-3 px-5 mt-2">
              Recuperar cuenta
            </button>
          </form>
        </div>

        <p className="text-center mt-4 fs-5 recuperar-info">
          Te enviaremos un correo con un link de recuperación de tu cuenta.
        </p>

        {mensaje && (
          <div className="alert alert-success text-center mt-4 rounded-4 shadow-sm w-75">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecuperarContrasena;
