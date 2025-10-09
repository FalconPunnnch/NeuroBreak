import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SobreNosotros.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import birrete from "../../assets/birrete.png";
import image16 from "../../assets/image-16.png";

const SobreNosotros = () => {
  const location = useLocation();

  useEffect(() => {
    const sobre = document.getElementById("sobre-section");
    const como = document.getElementById("como-funciona-section");
    if (location.pathname === "/sobre-nosotros") {
      sobre?.scrollIntoView({ behavior: "smooth" });
    } else if (location.pathname === "/como-funciona") {
      como?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="sobre-nosotros-page">
      <Header />

      {/* Sección Sobre NeuroBreak */}
      <section id="sobre-section" className="py-5 sobre-section">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-12 col-md-6">
              <div className="p-4 rounded-4 sobre-box text-white">
                <h2 className="fw-bold mb-3">Sobre NeuroBreak</h2>
                <p>
                  NeuroBreak es una iniciativa orientada a mejorar el bienestar
                  emocional y cognitivo mediante pausas activas.
                </p>
                <p>
                  Promueve el equilibrio entre estudio, trabajo y descanso,
                  integrando neurociencia y tecnología.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 text-center">
              <img
                src={image16}
                alt="Universidad de Lima"
                className="img-fluid sobre-img"
              />
            </div>
          </div>

          <div className="row align-items-center flex-md-row-reverse">
            <div className="col-12 col-md-6">
              <div className="p-4 rounded-4 sobre-box text-white">
                <h2 className="fw-bold mb-3">Un proyecto para ISW2</h2>
                <p>
                  Desarrollado por estudiantes comprometidos con la innovación y
                  el bienestar dentro del ámbito académico.
                </p>
                <p>
                  NeuroBreak combina tecnología web, interacción emocional y
                  estrategias de pausa productiva.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 text-center">
              <img
                src={birrete}
                alt="Birrete"
                className="img-fluid sobre-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sección Cómo Funciona */}
      <section id="como-funciona-section" className="py-5 como-funciona-section text-center">
        <div className="container">
          <h2 className="fw-bold mb-5 como-title">¿Cómo funciona NeuroBreak?</h2>

          <div className="row g-5 justify-content-center">
            <div className="col-12 col-md-4">
              <div className="paso-card p-4 rounded-3">
                <p className="paso-text">
                  Regístrate en la plataforma y selecciona tus preferencias de
                  descanso y concentración.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="paso-card p-4 rounded-3">
                <p className="paso-text">
                  Usa los microdescansos guiados para mejorar tu rendimiento
                  durante el día.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="paso-card p-4 rounded-3">
                <p className="paso-text">
                  Mide tu progreso y ajusta tus pausas según tus emociones y
                  nivel de energía.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Link
              to="/registro"
              className="btn btn-warning text-white px-5 py-3 fw-semibold rounded-pill shadow-sm"
            >
              Registrarme
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SobreNosotros;
