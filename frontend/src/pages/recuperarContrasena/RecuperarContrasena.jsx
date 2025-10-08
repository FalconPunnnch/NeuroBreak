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

    // Aquí iría la lógica para enviar el correo de recuperación
    console.log("Recuperar contraseña para:", correo);
    setMensaje("Te hemos enviado un correo con las instrucciones para recuperar tu cuenta.");
    
    // Opcional: redirigir después de 3 segundos
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const handleVolver = () => {
    navigate("/login");
  };

  return (
    <div className="recuperar-contrasena-page">
      <Header />

      <div className="recuperar-content">
        <button className="volver-btn-recuperar" onClick={handleVolver}>
          Volver
        </button>

        <div className="recuperar-box">
          <h1 className="recuperar-titulo">¿Olvidaste tu contraseña?</h1>
          
          <form onSubmit={handleSubmit} className="recuperar-form">
            <input
              type="email"
              className="recuperar-input"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

            <button type="submit" className="recuperar-btn">
              Recuperar cuenta
            </button>
          </form>
        </div>

        <p className="recuperar-info">
          Te enviaremos un correo con un link de recuperación de tu cuenta.
        </p>

        {mensaje && (
          <div className="mensaje-exito">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecuperarContrasena;