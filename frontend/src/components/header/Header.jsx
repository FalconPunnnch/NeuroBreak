import React from "react";
import { Link } from "react-router-dom";
import logoNb from "../../assets/logo-NB.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'; // Para mantener tus colores personalizados

const Header = () => {
  return (
    <header className="header shadow-sm">
      <nav className="navbar navbar-expand-lg container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logoNb} alt="Logo NB" className="logo-nb me-2" />
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

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav gap-4">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white fw-medium">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/como-funciona" className="nav-link text-white fw-medium">¿Cómo funciona?</Link>
            </li>
            <li className="nav-item">
              <Link to="/sobre-nosotros" className="nav-link text-white fw-medium">Sobre nosotros</Link>
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
