import React from "react";
import "./Footer.css";
const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <footer id="sobre-nosotros" className="footer py-5"> 
      <div className="container text-center">
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-5">
          <button
            onClick={() => scrollToSection('como-funciona')}
            className="footer-link text-white text-decoration-none bg-transparent border-0"
            style={{ cursor: 'pointer' }}
          >
            ¿Cómo funciona?
          </button>
          <span className="footer-year text-white fw-bold fs-5">
            2025
          </span>
          <span className="footer-link text-white">
            Sobre nosotros
          </span>
        </div>
        <div className="mt-4">
          <p className="text-white small mb-2">
            NeuroBreak - Plataforma de microactividades de bienestar para estudiantes
          </p>
          <p className="text-white small mb-0">
            Proyecto Ingeniería de Software 2 © 2025
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
