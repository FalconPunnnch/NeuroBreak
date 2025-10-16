import React from "react"
import { Link } from "react-router-dom"
import "./Performance.css"
import birrete from "../../imagenes/birrete.png"

const Performance = () => {
  return (
    <section className="performance-section pt-5 text-center">
      <div className="container pt-5">
        {/* 1. row: Contenedor principal de Flexbox.
          2. align-items-stretch: Asegura que todas las columnas tengan la misma altura (la de la más alta).
          3. g-5: Agrega espacio (gap) entre las columnas.
        */}
        <div className="row align-items-stretch justify-content-center g-5 pt-3 pb-3" style={{ minHeight: '400px' }}>
          {/* Columna 1: Texto Arriba a la Izquierda
            - col-md-4: 1/3 del ancho en dispositivos medianos.
            - text-md-start: Alinea el texto a la izquierda.
            - align-self-start: Alinea el contenido de esta columna a la parte SUPERIOR.
          */}
          <div className="col-12 col-md-4 text-md-start align-self-start">
            <h2 className="performance-title mb-3">Mejora tu desempeño</h2>
            <p className="performance-text">
              Aprende a manejar tu energía para rendir mejor en tus estudios o trabajo.
            </p>
          </div>

          {/* Columna 2: Imagen Centrada (Vertical y Horizontal)
            - col-md-4: 1/3 del ancho.
            - d-flex justify-content-center: Centra horizontalmente.
            - align-self-center: Alinea el contenido de esta columna al CENTRO.
          */}
          <div className="col-12 col-md-4 d-flex justify-content-center align-self-center">
            <img src={birrete} alt="Birrete" className="img-fluid performance-img" />
          </div>

          {/* Columna 3: Texto Abajo a la Derecha
            - col-md-4: 1/3 del ancho.
            - text-md-end: Alinea el texto a la derecha.
            - align-self-end: Alinea el contenido de esta columna a la parte INFERIOR.
          */}
          <div className="col-12 col-md-4 text-md-end align-self-end">
            <h2 className="performance-title mb-3">Aumenta tu productividad</h2>
            <p className="performance-text">
              Usa tus pausas de forma estratégica para potenciar tus resultados.
            </p>
          </div>
        </div>

        {/* Botón (Mantenemos la estructura original) */}
        <div className="text-center mt-5">
          <Link to="/registro" className="btn btn-warning text-white px-4 py-4 fw-semibold shadow-sm rounded-top-4 rounded-bottom-0">
            Registrarme
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Performance