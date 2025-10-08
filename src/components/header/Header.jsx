import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import logoNb from "../../assets/logo-NB.png";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <img className="logo-nb" alt="Logo NB" src={logoNb} />
        </div>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/como-funciona" className="nav-link">¿Cómo funciona?</Link>
          <Link to="/sobre-nosotros" className="nav-link">Sobre nosotros</Link>
        </nav>

        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </header>
  );
};

export default Header;