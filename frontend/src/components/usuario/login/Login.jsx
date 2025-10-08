import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import Header from "../../header/Header";
import brain1 from "../../../assets/brain-1.png";
import pesas from "../../../assets/pesas.png";
import pieza from "../../../assets/pieza.png";

const Login = () => {
  const [formData, setFormData] = useState({
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
    console.log("Iniciar sesión con:", formData);
  };

  return (
    <div className="login-usuario">
      <Header />

      <div className="login-content">
        {/* Columna Izquierda - Información con iconos */}
        <div className="info-side-login">
          <h1 className="main-title-login">Realiza descansos según tu necesidad</h1>
          
          {/* Iconos de beneficios */}
          <div className="beneficios-container">
            <div className="br">
              <div className="ellipse-m">
                <img className="brain" alt="Brain" src={brain1} />
              </div>
              <div className="text-wrapper-10">Mente</div>
            </div>

            <div className="cr">
              <div className="ellipse-cr">
                <img className="pieza" alt="Pieza" src={pieza} />
              </div>
              <div className="text-wrapper-9">Creatividad</div>
            </div>

            <div className="cu">
              <div className="ellipse-cu">
                <img className="pesas" alt="Pesas" src={pesas} />
              </div>
              <div className="text-wrapper-11">Cuerpo</div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Formulario */}
        <div className="form-side-login">
          <div className="form-container-login">
            {/* Tabs */}
            <div className="tabs-login">
              <Link to="/registro" className="tab-login">Crear cuenta</Link>
              <div className="tab-login active">Iniciar Sesión</div>
              <img className="line-underline" alt="Line" />
            </div>

            {/* Formulario con SOLO 2 campos */}
            <form onSubmit={handleSubmit} className="form-login">
              <input
                type="email"
                name="correo"
                placeholder="Ingresa tu correo"
                value={formData.correo}
                onChange={handleInputChange}
                className="input-field-login"
                required
              />
              
              <input
                type="password"
                name="contraseña"
                placeholder="Ingresa tu contraseña"
                value={formData.contraseña}
                onChange={handleInputChange}
                className="input-field-login"
                required
              />

              <Link to="/recuperar-contrasena" className="forgot-password-login"> ¿Olvidaste tu contraseña? </Link>

              <button type="submit" className="submit-button-login">
                Ingresar
              </button>
            </form>

            {/* Redes sociales */}
            <div className="social-section-login">
              <p className="social-text-login">o continúe con</p>
              <div className="social-buttons-login">
                <button type="button" className="social-button-login">
                  <svg viewBox="0 0 48 48" className="social-icon-login">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                </button>
                <button type="button" className="social-button-login">
                  <svg viewBox="0 0 48 48" className="social-icon-login">
                    <path fill="#f25022" d="M0 0h23v23H0z"/>
                    <path fill="#00a4ef" d="M25 0h23v23H25z"/>
                    <path fill="#7fba00" d="M0 25h23v23H0z"/>
                    <path fill="#ffb900" d="M25 25h23v23H25z"/>
                  </svg>
                </button>
                <button type="button" className="social-button-login">
                  <svg viewBox="0 0 48 48" className="social-icon-login">
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

export default Login;