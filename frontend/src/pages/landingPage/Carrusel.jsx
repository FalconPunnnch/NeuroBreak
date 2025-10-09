import React from "react";
import { Carousel } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Carrusel.css";

const Carrusel = () => {
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

  return (
    <section className="hero-section d-flex align-items-center justify-content-center text-center text-white">
      <Carousel
        indicators
        controls
        interval={5000}
        pause="hover"
        className="w-100"
      >
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <div className="hero-background" />
            <div className="hero-content mx-auto">
              <h1 className="hero-title mb-3">{slide.title}</h1>
              <p className="hero-text mx-auto">{slide.text}</p>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

export default Carrusel;
