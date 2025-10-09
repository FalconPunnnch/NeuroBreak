import React from "react";
import { Link } from "react-router-dom";
import "./Performance.css";
import birrete from "../../assets/birrete.png";

const Performance = () => {
  return (
    <section className="performance-section py-5 text-center">
      <div className="container">
        <div className="row align-items-center justify-content-center g-5">
          {/* Izquierda */}
          <div className="col-12 col-md-4 text-md-start">
            <h2 className="performance-title mb-3">Mejora tu desempeño</h2>
            <p className="performance-text">
              Aprende a manejar tu energía para rendir mejor en tus estudios o trabajo.
            </p>
          </div>

          {/* Imagen */}
          <div className="col-12 col-md-4 d-flex justify-content-center">
            <img src={birrete} alt="Birrete" className="img-fluid performance-img" />
          </div>

          {/* Derecha */}
          <div className="col-12 col-md-4 text-md-end">
            <h2 className="performance-title mb-3">Aumenta tu productividad</h2>
            <p className="performance-text">
              Usa tus pausas de forma estratégica para potenciar tus resultados.
            </p>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link
            to="/registro"
            className="btn btn-warning text-white px-5 py-3 fw-semibold rounded-pill shadow-sm"
          >
            Registrarme
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Performance;
