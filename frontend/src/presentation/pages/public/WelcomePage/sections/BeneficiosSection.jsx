// HU01 - Beneficios Section FINAL (con Bootstrap)
// Ubicación: frontend/src/presentation/pages/public/WelcomePage/sections/BeneficiosSection.jsx

import React from "react";
import "./BeneficiosSection.css";
import brainIcon from "../../../../../assets/images/brain-1.png";
import puzzleIcon from "../../../../../assets/images/pieza.png";
import dumbbellIcon from "../../../../../assets/images/pesas.png";

const BeneficiosSection = () => {
  const beneficios = [
    {
      id: 1,
      icon: brainIcon,
      title: "Mente",
      description: "Mejora tu enfoque y claridad mental con técnicas de relajación activa."
    },
    {
      id: 2,
      icon: puzzleIcon,
      title: "Creatividad",
      description: "Estimula tu pensamiento lateral y genera nuevas ideas en menos tiempo."
    },
    {
      id: 3,
      icon: dumbbellIcon,
      title: "Cuerpo",
      description: "Activa tu cuerpo con microejercicios que mejoran tu energía y postura."
    }
  ];

  return (
    <section id="beneficios" className="beneficios-section py-5">
      <div className="container text-center">
        <h2 className="section-title mb-5">Beneficios</h2>

        <div className="row justify-content-center">
          {beneficios.map((beneficio, index) => (
            <div
              key={beneficio.id}
              className="col-12 col-sm-6 col-md-4 mb-4"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="beneficio-card p-3 h-100 d-flex flex-column align-items-center justify-content-center">
                <div className="beneficio-icon-wrapper mb-3">
                  <img
                    src={beneficio.icon}
                    alt={`Icono ${beneficio.title}`}
                    className="beneficio-icon"
                  />
                </div>
                <h3 className="beneficio-title">{beneficio.title}</h3>
                <p className="beneficio-description">{beneficio.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeneficiosSection;
