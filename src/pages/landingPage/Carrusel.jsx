import React, { useState, useEffect } from "react";
import "./Carrusel.css";

const Carrusel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Datos del carrusel
  const slides = [
    {
      title: "Lorem ipsum",
      text: "lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam nonummy nibh euismod tincidunt"
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

  // Funciones para navegar el carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play opcional (descomenta si lo quieres)
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);
  */

  return (
    <div className="hero-section">
      <div className="hero-background" />
      <div className="hero-content">
        <h1 className="hero-title">{slides[currentSlide].title}</h1>
        <p className="hero-text">{slides[currentSlide].text}</p>
      </div>
      
      {/* Carousel dots */}
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Carousel arrows */}
      <button className="carousel-btn prev" onClick={prevSlide}>
        ‹
      </button>
      <button className="carousel-btn next" onClick={nextSlide}>
        ›
      </button>
    </div>
  );
};

export default Carrusel;