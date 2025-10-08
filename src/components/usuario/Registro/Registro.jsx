import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Registro.css";
import Header from "../../header/Header";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registrar usuario:", formData);
  };

  return (
    <div className="registro">
      <Header />

      <div className="registro-content">
        {/* Columna Izquierda - Información */}
        <div className="info-side">
          <h1 className="main-title">Realiza descansos según tu necesidad</h1>
          
          <div className="info-list">
            <p className="info-item">
              lorem ipsum dolor sit amet consectetuer adipiscing elit
            </p>
            <p className="info-item">
              lorem ipsum dolor sit amet consectetuer adipiscing elit
            </p>
            <p className="info-item">
              lorem ipsum dolor sit amet consectetuer adipiscing elit
            </p>
          </div>
        </div>

        {/* Columna Derecha - Formulario */}
        <div className="form-side">
          <div className="form-container">
            {/* Tabs */}
            <div className="tabs">
              <div className="tab active">Crear cuenta</div>
              <Link to="/login" className="tab">Iniciar Sesión</Link>
            </div>

            {/* Formulario con 4 campos */}
            <form onSubmit={handleSubmit} className="form">
              <input
                type="text"
                name="nombre"
                placeholder="Ingresa tu nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="input-field"
                required
              />
              
              <input
                type="text"
                name="apellido"
                placeholder="Ingresa tu apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="input-field"
                required
              />
              
              <input
                type="email"
                name="correo"
                placeholder="Ingresa tu correo"
                value={formData.correo}
                onChange={handleInputChange}
                className="input-field"
                required
              />
              
              <input
                type="password"
                name="contraseña"
                placeholder="Ingresa una contraseña"
                value={formData.contraseña}
                onChange={handleInputChange}
                className="input-field"
                required
              />

              <button type="submit" className="submit-button">
                Registrarme
              </button>
            </form>

            {/* Redes sociales */}
            <div className="social-section">
              <p className="social-text">o continúe con</p>
              <div className="social-buttons">
                <button type="button" className="social-button">
                  <svg viewBox="0 0 48 48" className="social-icon">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                </button>
                <button type="button" className="social-button">
                  <svg viewBox="0 0 48 48" className="social-icon">
                    <path fill="#f25022" d="M0 0h23v23H0z"/>
                    <path fill="#00a4ef" d="M25 0h23v23H25z"/>
                    <path fill="#7fba00" d="M0 25h23v23H0z"/>
                    <path fill="#ffb900" d="M25 25h23v23H25z"/>
                  </svg>
                </button>
                <button type="button" className="social-button">
                  <svg viewBox="0 0 48 48" className="social-icon">
                    <path d="M38.71 20.07C37.35 18.72 35.28 18 33 18c-2.28 0-4.35.72-5.71 2.07-1.36 1.35-2.29 3.29-2.29 5.43 0 2.14.93 4.08 2.29 5.43C28.65 32.28 30.72 33 33 33c2.28 0 4.35-.72 5.71-2.07C40.07 29.58 41 27.64 41 25.5c0-2.14-.93-4.08-2.29-5.43zM24 5c1.93 0 3.5 1.57 3.5 3.5S25.93 12 24 12s-3.5-1.57-3.5-3.5S22.07 5 24 5m0 32c-6.075 0-11-4.925-11-11s4.925-11 11-11 11 4.925 11 11-4.925 11-11 11z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;