import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HeaderLogin.css";
import logoNb from "../../imagenes/NeuroBreak.png";

const HeaderLogin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí irá la lógica de logout
    navigate("/");
  };

  return (
    <header className="header-login">
      <div className="header-login-container">
        <Link to="/catalogo" className="logo-section-login">
          <img className="logo-nb-login" alt="Logo NB" src={logoNb} />
        </Link>

        <nav className="nav-menu-login">
          <Link to="/catalogo" className="nav-link-login active">
            Catálogo de Actividades
          </Link>
          <Link to="/estadisticas" className="nav-link-login">
            Mis Estadísticas
          </Link>
          <Link to="/perfil" className="nav-link-login">
            Mi perfil
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default HeaderLogin;