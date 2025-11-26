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
    <section id="beneficios" className="beneficios-section">
      <div className="container">
        <h2 className="section-title">Beneficios</h2>
        <div className="beneficios-grid">
          {beneficios.map((beneficio, index) => (
            <div 
              key={beneficio.id} 
              className="beneficio-card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="beneficio-icon-wrapper">
                <img 
                  src={beneficio.icon} 
                  alt={`Icono ${beneficio.title}`} 
                  className="beneficio-icon" 
                />
              </div>
              <h3 className="beneficio-title">{beneficio.title}</h3>
              <p className="beneficio-description">{beneficio.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default BeneficiosSection;
