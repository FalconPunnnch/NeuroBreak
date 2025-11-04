// HU01 - Header Component FINAL
// Ubicación: frontend/src/presentation/components/layout/Header/Header.jsx

import React from "react";
import { Link } from "react-router-dom";
import logoNb from "../../../../assets/images/NeuroBreak.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';

const Header = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="header shadow-sm">
      <nav className="navbar navbar-expand-lg container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logoNb} alt="Logo NeuroBreak" className="logo-nb me-2" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end align-items-center" id="navbarNav">
          <ul className="navbar-nav gap-4 me-3">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white fw-medium">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => scrollToSection('como-funciona')} 
                className="nav-link text-white fw-medium bg-transparent border-0"
                style={{ cursor: 'pointer' }}
              >
                ¿Cómo funciona?
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => scrollToSection('sobre-nosotros')} 
                className="nav-link text-white fw-medium bg-transparent border-0"
                style={{ cursor: 'pointer' }}
              >
                Sobre nosotros
              </button>
            </li>
          </ul>
        </div>

        <div className="d-flex">
          <Link to="/login" className="btn login-btn fw-semibold px-4">
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;