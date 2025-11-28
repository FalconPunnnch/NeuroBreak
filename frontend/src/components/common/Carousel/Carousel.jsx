import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Carrusel.css";
const Carrusel = () => {
  const slides = [
    {
      title: "Bienvenido a NeuroBreak",
      text: "Tu plataforma de microactividades de bienestar diseñada para estudiantes universitarios"
    },
    {
      title: "Mejora tu enfoque",
      text: "Aumenta tu concentración y productividad con nuestras técnicas de microactividad"
    },
    {
      title: "Descansos inteligentes",
      text: "Optimiza tu tiempo con pausas estratégicas que mejoran tu rendimiento"
    }
  ];
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    <section className="hero-section d-flex flex-column align-items-center justify-content-center text-center text-white gap-5">
      {}
      <div className="w-100 pt-5">
        <Carousel
          indicators={false} 
          controls={true}
          interval={5000}
          pause="hover"
          activeIndex={index}
          onSelect={handleSelect}
          fade
        >
          {slides.map((slide, i) => (
            <Carousel.Item key={i}>
              <div className="hero-background" />
              <div className="hero-content mx-auto">
                <h1 className="hero-title mt-3 mb-4">{slide.title}</h1>
                <p className="hero-text mx-auto">{slide.text}</p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      {}
      <div className="custom-indicators-wrapper mt-5 pt-5 d-flex align-content-end">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(i)}
            className={`indicator-dot ${i === index ? 'active' : ''}`}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
export default Carrusel;
