import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Link to="/como-funciona" className="footer-link">¿Cómo funciona?</Link>
        <span className="footer-year">2025</span>
        <Link to="/sobre-nosotros" className="footer-link">Sobre nosotros</Link>
      </div>
    </footer>
  );
};

export default Footer;