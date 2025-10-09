import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import Header from "../../header/Header";
import brain from "../../../assets/brain-1.png";
import pesas from "../../../assets/pesas.png";
import pieza from "../../../assets/pieza.png";

const Login = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contraseña: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Iniciar sesión con:", formData);
  };

  return (
    <div className="login-usuario bg-dark-blue text-white">
      <Header />

      <div className="container py-5">
        <div className="row align-items-center g-5">
          {/* --- Columna Izquierda (Beneficios) --- */}
          <div className="col-lg-6 text-center">
            <h1 className="fw-semibold mb-5">
              Realiza descansos según tu necesidad
            </h1>

            <div className="d-flex justify-content-center flex-wrap gap-5">
              {[
                { src: brain, label: "Mente" },
                { src: pieza, label: "Creatividad" },
                { src: pesas, label: "Cuerpo" },
              ].map((item, idx) => (
                <div key={idx} className="beneficio text-center">
                  <div className="beneficio-circle bg-light mx-auto mb-3 d-flex align-items-center justify-content-center">
                    <img src={item.src} alt={item.label} className="icono" />
                  </div>
                  <p className="fw-semibold mb-0">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* --- Columna Derecha (Formulario) --- */}
          <div className="col-lg-6">
            <div className="bg-light-blue text-white rounded-4 shadow p-5 mx-auto" style={{ maxWidth: "450px" }}>
              {/* Tabs */}
              <div className="d-flex justify-content-center gap-4 mb-4">
                <Link
                  to="/registro"
                  className="tab text-white text-decoration-none"
                >
                  Crear cuenta
                </Link>
                <span className="tab active">Iniciar Sesión</span>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <input
                  type="email"
                  name="correo"
                  placeholder="Ingresa tu correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  className="form-control rounded-3"
                  required
                />
                <input
                  type="password"
                  name="contraseña"
                  placeholder="Ingresa tu contraseña"
                  value={formData.contraseña}
                  onChange={handleInputChange}
                  className="form-control rounded-3"
                  required
                />

                <Link
                  to="/recuperar-contrasena"
                  className="text-white text-center fw-semibold small mt-1"
                >
                  ¿Olvidaste tu contraseña?
                </Link>

                <button
                  type="submit"
                  className="btn btn-warning-custom fw-semibold mt-2"
                >
                  Ingresar
                </button>

              </form>

              {/* Redes sociales */}
              <div className="text-center mt-4">
                <p className="fw-semibold mb-3">O continúa con</p>
                <div className="d-flex justify-content-center gap-3">
                  {[
                    { icon: "bi-google", color: "text-danger" },
                    { icon: "bi-microsoft", color: "text-primary" },
                    { icon: "bi-apple", color: "text-dark" },
                  ].map((btn, i) => (
                    <button
                      key={i}
                      type="button"
                      className="btn btn-light social-btn d-flex align-items-center justify-content-center rounded-circle"
                    >
                      <i className={`bi ${btn.icon} fs-5 ${btn.color}`}></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
