import React, { useState } from "react"
import { Carousel } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'
import "./Carrusel.css"

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
  ]

  // 1. Creamos un estado para guardar el índice del slide actual
  const [index, setIndex] = useState(0);

  // 2. Creamos una función que actualiza el estado cuando el slide cambia
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  }

  return (
    // Cambiamos la dirección de flex a columna para apilar el carrusel y los indicadores
    <section className="hero-section d-flex flex-column align-items-center justify-content-center text-center text-white gap-5">
      
      {/* ===== DIVISIÓN 1: CONTENIDO DEL CARRUSEL ===== */}
      <div className="w-100 pt-5">
        <Carousel
          // 3. Desactivamos los indicadores por defecto
          indicators={false} 
          controls
          interval={5000}
          pause="hover"
          // 4. Conectamos el carrusel a nuestro estado
          activeIndex={index}
          onSelect={handleSelect}
        >
          {slides.map((slide, i) => (
            <Carousel.Item key={i}>
              <div className="hero-background" />
              <div className="hero-content mx-auto">
                <h1 className="hero-title mt-3 mb-3">{slide.title}</h1>
                <p className="hero-text mx-auto">{slide.text}</p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* ===== DIVISIÓN 2: INDICADORES PERSONALIZADOS ===== */}
      <div className="custom-indicators-wrapper mt-5 pt-5 d-flex align-content-end">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            // Al hacer clic, llamamos a handleSelect para cambiar de slide
            onClick={() => handleSelect(i)}
            // Le damos la clase 'active' si su índice coincide con el estado actual
            className={`indicator-dot ${i === index ? 'active' : ''}`}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>

    </section>
  )
}

export default Carrusel