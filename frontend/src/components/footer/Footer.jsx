import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer py-3">
      <div className="container text-center">
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
          <Link to="/como-funciona" className="footer-link">
            ¿Cómo funciona?
          </Link>
          <span className="footer-year">2025</span>
          <Link to="/sobre-nosotros" className="footer-link">
            Sobre nosotros
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
