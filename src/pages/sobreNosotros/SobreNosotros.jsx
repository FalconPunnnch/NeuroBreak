import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";  // ← Agrega Link aquí
import "./SobreNosotros.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import birrete from "../../assets/birrete.png";
import image16 from "../../assets/image-16.png";

const SobreNosotros = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/sobre-nosotros") {
      document.getElementById("sobre-section")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    } else if (location.pathname === "/como-funciona") {
      document.getElementById("como-funciona-section")?.scrollIntoView({ 
        behavior: "smooth" 
      });
    }
  }, [location]);

  return (
    <div className="sobre-nosotros-page">
      <Header />

      {/* Sección Sobre NeuroBreak */}
      <section id="sobre-section" className="sobre-section">
        <div className="sobre-background" />
        
        <div className="sobre-container">
          {/* Fila 1: Caja izquierda + Logo derecha */}
          <div className="sobre-row row-1">
            <div className="sobre-box">
              <h2 className="sobre-title">Sobre NeuroBreak</h2>
              <p className="sobre-text">
                lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam nonummy nibh
              </p>
              <p className="sobre-text">
                lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam nonummy nibh
              </p>
            </div>

            <div className="logo-container">
              <img className="sobre-image" alt="Universidad de Lima" src={image16} />
            </div>
          </div>

          {/* Fila 2: Birrete izquierda + Caja derecha */}
          <div className="sobre-row row-2">
            <div className="birrete-container">
              <img className="birrete-img" alt="Birrete" src={birrete} />
            </div>

            <div className="sobre-box">
              <h2 className="sobre-title">Un proyecto para ISW2</h2>
              <p className="sobre-text">
                lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam nonummy nibh
              </p>
              <p className="sobre-text">
                lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam nonummy nibh
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Cómo Funciona */}
      <section id="como-funciona-section" className="como-funciona-section">
        <div className="como-background" />
        <h2 className="como-title">¿Cómo funciona NeuroBreak?</h2>

        <div className="pasos-grid">
          <div className="paso-card">
            <p className="paso-text">
              lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam
              nonummy nibh euismod tincidunt
            </p>
          </div>

          <div className="paso-card">
            <p className="paso-text">
              lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam
              nonummy nibh euismod tincidunt
            </p>
          </div>

          <div className="paso-card">
            <p className="paso-text">
              lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam
              nonummy nibh euismod tincidunt
            </p>
          </div>
        </div>

        <Link to="/registro" className="register-btn-como">
          Registrarme
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default SobreNosotros;