import React from "react";
import { Link } from "react-router-dom";
import "./PerformanceSection.css";
import birreteImg from "assets/images/birrete.png";
const PerformanceSection = () => {
  return (
    <section id="como-funciona" className="performance-section">
      <div className="container">
        <div className="performance-grid">
          <div className="performance-item performance-left">
            <h2 className="performance-title">Mejora tu desempeño</h2>
            <p className="performance-text">
              Aprende a manejar tu energía para rendir mejor en tus estudios o trabajo.
            </p>
          </div>
          <div className="performance-item performance-center">
            <img 
              src={birreteImg} 
              alt="Birrete de graduación" 
              className="performance-image" 
            />
          </div>
          <div className="performance-item performance-right">
            <h2 className="performance-title">Aumenta tu productividad</h2>
            <p className="performance-text">
              Usa tus pausas de forma estratégica para potenciar tus resultados.
            </p>
          </div>
        </div>
        <div className="cta-wrapper">
          <Link to="/register" className="btn-register">
            Registrarme
          </Link>
        </div>
      </div>
    </section>
  );
};
export default PerformanceSection;
