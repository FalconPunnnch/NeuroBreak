import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from 'contexts/AuthContext';
import logoNb from "assets/images/NeuroBreak.png";
import { roleStrategyFactory } from 'patterns/roles/RoleStrategyFactory';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-menu')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate('/');
  };
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
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
              <Link to="/catalog" className="nav-link text-white fw-medium">
                Catálogo
              </Link>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => scrollToSection('sobre-nosotros')} 
                className="nav-link text-white fw-medium"
                style={{ cursor: 'pointer' }}
              >
                Sobre nosotros
              </button>
            </li>
          </ul>
        </div>
        <div className="d-flex position-relative">
          {isAuthenticated && user ? (
            <div className="user-menu">
              <button 
                className="btn user-menu-btn fw-semibold px-4 d-flex align-items-center gap-2"
                onClick={toggleDropdown}
                aria-expanded={showDropdown}
                aria-haspopup="true"
                type="button"
              >
                <span>Hola, {user.firstName}</span>
                <i className={`fas fa-chevron-${showDropdown ? 'up' : 'down'}`}></i>
              </button>
              <div
                className={`dropdown-menu-custom${showDropdown ? ' show' : ''}`}
                style={{ display: showDropdown ? 'block' : 'none' }}
                role="menu"
                aria-label="Opciones de usuario"
              >
                <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <i className="fas fa-user me-2"></i>Perfil
                </Link>
                <Link
                  to={user ? roleStrategyFactory.getRedirectionData(user).path : '/catalog'}
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  <i className="fas fa-chart-bar me-2"></i>Dashboard
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn login-btn fw-semibold px-4">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};
export default Header;
