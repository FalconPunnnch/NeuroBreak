import { Link } from "react-router-dom";
import { useAuth } from "../../../../state/contexts/AuthContext";
import logoNb from "../../../../assets/images/NeuroBreak.png";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shadow-sm"
      style={{ backgroundColor: "#93BDCC" }}
    >
      <div className="container d-flex align-items-center">
        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logoNb}
            alt="NeuroBreak"
            style={{ height: "70px", objectFit: "contain" }}
            className="me-2"
          />
        </Link>

        {/* Botón hamburguesa (pantallas pequeñas) */}
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

        {/* Links de navegación */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav gap-3 text-center">
            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a
                href="#como-funciona"
                className="nav-link text-white fw-semibold"
              >
                ¿Cómo funciona?
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#sobre-nosotros"
                className="nav-link text-white fw-semibold"
              >
                Sobre nosotros
              </a>
            </li>
          </ul>
        </div>

        {/* Sección derecha */}
        <div className="ms-auto">
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2">
              <span className="text-white fw-bold">
                👤 {user?.nombre ?? "Usuario"}
              </span>
              <button
                className="btn text-white fw-bold"
                style={{ backgroundColor: "#EDC04E", borderRadius: "10px" }}
                onClick={logout}
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn text-white fw-bold"
              style={{ backgroundColor: "#EDC04E", borderRadius: "10px" }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
