import React from "react";
import { Link } from "react-router-dom"
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer py-5"> 
      <div className="container text-center">
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-5">
          <Link to="/como-funciona" className="footer-link text-white text-decoration-none">
            ¿Cómo funciona?
          </Link>
          <span className="footer-year text-white fw-bold fs-5">
            2025
          </span>
          <Link to="/sobre-nosotros" className="footer-link text-white text-decoration-none">
            Sobre nosotros
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer