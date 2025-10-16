import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../header/Header";
import "./Registro.css";

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
    <div className="registro bg-dark-blue min-vh-100 d-flex flex-column">
      <Header />

      <div className="container flex-grow-1 d-flex align-items-center py-5 mt-4">
        <div className="row w-100 align-items-center gy-5">
          {/* Columna izquierda */}
          <div className="col-lg-6 text-white text-center text-lg-start">
            <h1 className="fw-bold mb-5 display-5">
              Realiza descansos según tu necesidad
            </h1>
            <ul className="list-unstyled fs-5 lh-lg">
              <li>lorem ipsum dolor sit amet consectetuer adipiscing elit</li>
              <li>lorem ipsum dolor sit amet consectetuer adipiscing elit</li>
              <li>lorem ipsum dolor sit amet consectetuer adipiscing elit</li>
            </ul>
          </div>

          {/* Columna derecha */}
          <div className="col-lg-6 d-flex justify-content-center">
            <div className="bg-light-blue text-white rounded-4 p-5 w-100" style={{ maxWidth: "500px" }}>
              {/* Tabs */}
              <div className="d-flex justify-content-center gap-5 mb-4">
                <span className="tab active me-3">Crear cuenta</span>
                <Link to="/login" className="tab text-white text-decoration-none">Iniciar Sesión</Link>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ingresa tu nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="form-control rounded-3 py-2"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Ingresa tu apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    className="form-control rounded-3 py-2"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    name="correo"
                    placeholder="Ingresa tu correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="form-control rounded-3 py-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    name="contraseña"
                    placeholder="Ingresa una contraseña"
                    value={formData.contraseña}
                    onChange={handleInputChange}
                    className="form-control rounded-3 py-2"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-warning-custom fw-semibold mt-2">
                  Registrarme
                </button>
              </form>

              {/* Redes sociales */}
              <div className="text-center mt-4">
                <h6 className="fw-semibold mb-3">o continúa con</h6>
                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-light d-flex align-items-center justify-content-center rounded-circle social-btn"
                  >
                    <i className="bi bi-google text-danger fs-4"></i>
                  </button>
                  <button
                    className="btn btn-light d-flex align-items-center justify-content-center rounded-circle social-btn"
                  >
                    <i className="bi bi-microsoft text-primary fs-4"></i>
                  </button>
                  <button
                    className="btn btn-light d-flex align-items-center justify-content-center rounded-circle social-btn"
                  >
                    <i className="bi bi-apple text-dark fs-4"></i>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
