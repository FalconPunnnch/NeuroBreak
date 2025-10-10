import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // 👈 importa Bootstrap globalmente
import "./DetallesMicroActividad.css"; // 👈 opcional, si quieres agregar estilos propios

const DetallesMicroActividad = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const actividades = {
    1: {
      titulo: "Respiración profunda",
      categoria: "Mente",
      duracion: 2,
      tiempoConcentracion: 25,
      descripcion:
        "Ejercicio de respiración para relajar la mente y reducir el estrés."
    },
    2: {
      titulo: "Estiramientos",
      categoria: "Cuerpo",
      duracion: 5,
      tiempoConcentracion: 20,
      descripcion:
        "Realiza una serie de estiramientos suaves para relajar los músculos."
    }
  };

  const actividad = actividades[id] || actividades[1];

  const handleVolver = () => navigate("/catalogo");
  const handleEmpezarSesion = () =>
    navigate("/timer", {
      state: {
        tiempoConcentracion: actividad.tiempoConcentracion,
        duracionActividad: actividad.duracion,
        tituloActividad: actividad.titulo
      }
    });

  return (
    <div className="container py-5 text-center">
      <button
        className="btn btn-outline-secondary mb-4 d-flex align-items-center"
        onClick={handleVolver}
      >
        <i className="bi bi-arrow-left me-2"></i> Volver
      </button>

      <div className="card mx-auto shadow" style={{ maxWidth: "600px" }}>
        <div className="card-body bg-info text-white rounded-top">
          <h1 className="card-title mb-3">{actividad.titulo}</h1>
          <p className="card-text">{actividad.descripcion}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="d-flex justify-content-between bg-info bg-opacity-50 text-white rounded p-3 mb-3 mx-auto" style={{ maxWidth: "500px" }}>
          <span>Tiempo de concentración</span>
          <span>{actividad.tiempoConcentracion} minutos</span>
        </div>

        <div className="d-flex justify-content-between bg-info bg-opacity-50 text-white rounded p-3 mx-auto" style={{ maxWidth: "500px" }}>
          <span>Realizar micro actividad</span>
          <span>{actividad.duracion} minutos</span>
        </div>
      </div>

      <button className="btn btn-dark mt-4 px-5 py-3" onClick={handleEmpezarSesion}>
        Empezar sesión
      </button>
    </div>
  );
};

export default DetallesMicroActividad;
