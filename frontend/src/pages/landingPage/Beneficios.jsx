import React from "react";
import "./Beneficios.css";
import brain1 from "../../assets/brain-1.png";
import pieza from "../../assets/pieza.png";
import pesas from "../../assets/pesas.png";

const Beneficios = () => {
  return (
    <section className="beneficios-section text-center py-5">
      <div className="container">
        <h2 className="beneficios-title mb-5 fw-bold">Beneficios</h2>

        <div className="row justify-content-center g-5">
          {/* Mente */}
          <div className="col-12 col-md-4 d-flex flex-column align-items-center">
            <img src={brain1} alt="Mente" className="beneficio-img mb-3" />
            <h3 className="beneficio-subtitle mb-3">Mente</h3>
            <p className="beneficio-text px-3">
              Mejora tu enfoque y claridad mental con técnicas de relajación activa.
            </p>
          </div>

          {/* Creatividad */}
          <div className="col-12 col-md-4 d-flex flex-column align-items-center">
            <img src={pieza} alt="Creatividad" className="beneficio-img mb-3" />
            <h3 className="beneficio-subtitle mb-3">Creatividad</h3>
            <p className="beneficio-text px-3">
              Estimula tu pensamiento lateral y genera nuevas ideas en menos tiempo.
            </p>
          </div>

          {/* Cuerpo */}
          <div className="col-12 col-md-4 d-flex flex-column align-items-center">
            <img src={pesas} alt="Cuerpo" className="beneficio-img mb-3" />
            <h3 className="beneficio-subtitle mb-3">Cuerpo</h3>
            <p className="beneficio-text px-3">
              Activa tu cuerpo con microejercicios que mejoran tu energía y postura.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Beneficios;
