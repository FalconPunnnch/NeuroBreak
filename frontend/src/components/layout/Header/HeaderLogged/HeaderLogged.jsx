import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './HeaderLogged.css';
import logo from 'assets/images/NeuroBreak.png';

const HeaderLogged = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header-logged">
      <div className="header-logged-container">

        <Link to="/" className="header-logo">
          <img src={logo} alt="NeuroBreak" />
        </Link>

        <nav className="header-nav gap-4">
          <Link 
            to="/catalog"
            className={`nav-link ${isActive('/catalog') ? 'active' : ''}`}
          >
            Catálogo de Microactividades
          </Link>

          <Link
            to="/profile"
            className="profile-btn"
          >
            Mi perfil
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default HeaderLogged;
