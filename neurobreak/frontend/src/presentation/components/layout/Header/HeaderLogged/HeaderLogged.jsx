// Header para usuarios logueados
// frontend/src/presentation/components/layout/HeaderLogged/HeaderLogged.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './HeaderLogged.css';
import logo from '../../../../../assets/images/NeuroBreak.png';

const HeaderLogged = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header-logged">
      <div className="header-logged-container">
        
        {/* Logo */}
        <Link to="/catalog" className="header-logo">
          <img src={logo} alt="NeuroBreak" />
        </Link>

        {/* Navegación */}
        <nav className="header-nav">
          <Link 
            to="/catalog" 
            className={`nav-link ${isActive('/catalog') ? 'active' : ''}`}
          >
            Catálogo de Actividades
          </Link>

          <Link 
            to="/statistics" 
            className={`nav-link ${isActive('/statistics') ? 'active' : ''}`}
          >
            Mis Estadísticas
          </Link>

          <Link 
            to="/profile" 
            className={`nav-link nav-link-button ${isActive('/profile') ? 'active' : ''}`}
          >
            Mi perfil
          </Link>
        </nav>

      </div>
    </header>
  );
};

export default HeaderLogged;