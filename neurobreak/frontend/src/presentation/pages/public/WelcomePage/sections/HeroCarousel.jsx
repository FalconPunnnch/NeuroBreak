// HU01 - Hero Carousel Section FINAL
// Ubicación: frontend/src/presentation/pages/public/WelcomePage/sections/HeroCarousel.jsx

import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import "./HeroCarousel.css";

const HeroCarousel = () => {
  const slides = [
    {
      id: 1,
      title: "Bienvenido a NeuroBreak",
      text: "Tu plataforma de microactividades de bienestar diseñada para estudiantes universitarios"
    },
    {
      id: 2,
      title: "Mejora tu enfoque",
      text: "Aumenta tu concentración y productividad con nuestras técnicas de microactividad"
    },
    {
      id: 3,
      title: "Descansos inteligentes",
      text: "Optimiza tu tiempo con pausas estratégicas que mejoran tu rendimiento"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  return (
    <section className="hero-section">
      <div className="hero-carousel-wrapper">
        <Carousel
          activeIndex={activeIndex}
          onSelect={handleSelect}
          indicators={false}
          controls={true}
          interval={5000}
          pause="hover"
          fade
        >
          {slides.map((slide) => (
            <Carousel.Item key={slide.id}>
              <div className="hero-content-wrapper">
                <div className="hero-content">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-text">{slide.text}</p>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

        <div className="custom-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(index)}
              className={`indicator-dot ${index === activeIndex ? 'active' : ''}`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;