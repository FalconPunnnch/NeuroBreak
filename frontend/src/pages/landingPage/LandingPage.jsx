import React from "react";
import { Link } from "react-router-dom";  // ← Agrega esta línea
import "./LandingPage.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Carrusel from "./Carrusel";
import birrete from "../../assets/birrete.png";
import brain1 from "../../assets/brain-1.png";
import pesas from "../../assets/pesas.png";
import pieza from "../../assets/pieza.png";

export const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <Header />

      {/* Carrusel */}
      <Carrusel />

      {/* Beneficios Section */}
      <div className="beneficios-section">
        <div className="beneficios-background" />
        <h2 className="beneficios-title">Beneficios</h2>

        <div className="beneficios-grid">
          {/* Mente */}
          <div className="beneficio-card">
            <div className="ellipse-m">
              <img className="brain" alt="Brain" src={brain1} />
            </div>
            <h3 className="beneficio-subtitle">Mente</h3>
            <p className="beneficio-text">
              lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam
              nonummy nibh euismod tincidunt
            </p>
          </div>

          {/* Creatividad */}
          <div className="beneficio-card">
            <div className="ellipse-cr">
              <img className="pieza" alt="Pieza" src={pieza} />
            </div>
            <h3 className="beneficio-subtitle">Creatividad</h3>
            <p className="beneficio-text">
              lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam
              nonummy nibh euismod tincidunt
            </p>
          </div>

          {/* Cuerpo */}
          <div className="beneficio-card">
            <div className="ellipse-cu">
              <img className="pesas" alt="Pesas" src={pesas} />
            </div>
            <h3 className="beneficio-subtitle">Cuerpo</h3>
            <p className="beneficio-text">
              lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam
              nonummy nibh euismod tincidunt
            </p>
          </div>
        </div>
      </div>

      {/* Performance Section */}
      <div className="performance-section">
        <div className="performance-background" />
        
        <div className="performance-content">
          <div className="performance-left">
            <h2 className="performance-title">Mejora tu desempeño</h2>
            <p className="performance-text">
              lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam
              nonummy nibh
            </p>
          </div>

          <img className="birrete" alt="Birrete" src={birrete} />

          <div className="performance-right">
            <h2 className="performance-title">Aumenta tu productividad</h2>
            <p className="performance-text">
              lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam
              nonummy nibh
            </p>
          </div>
        </div>

        <Link to="/registro" className="register-btn">
          Registrarme
        </Link>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;