import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Timer.css";

const Timer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { tiempoConcentracion = 25, duracionActividad = 5, tituloActividad = "" } = location.state || {};
  
  const [tiempo, setTiempo] = useState(tiempoConcentracion * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [proximaActividad, setProximaActividad] = useState(3);

  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  };

  useEffect(() => {
    let intervalo;
    if (isRunning && tiempo > 0) {
      intervalo = setInterval(() => setTiempo((prev) => prev - 1), 1000);
    } else if (tiempo === 0) {
      setIsRunning(false);
      alert("¡Tiempo completado! Hora de tu microactividad.");
    }
    return () => clearInterval(intervalo);
  }, [isRunning, tiempo]);

  const handleIniciarPausar = () => setIsRunning(!isRunning);
  const handleReiniciar = () => {
    setTiempo(tiempoConcentracion * 60);
    setIsRunning(false);
  };
  const handleEstablecerTiempo = () => {
    const nuevoTiempo = prompt("Ingresa el tiempo de concentración en minutos:", tiempoConcentracion);
    if (nuevoTiempo && !isNaN(nuevoTiempo)) {
      setTiempo(parseInt(nuevoTiempo) * 60);
      setIsRunning(false);
    }
  };
  const handleVolver = () => navigate(-1);

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 bg-white position-relative">
      {/* Botón volver */}
      <button className="btn btn-link position-absolute top-0 start-0 m-4 text-decoration-none text-dark d-flex align-items-center"
        onClick={handleVolver}>
        <i className="bi bi-arrow-left fs-4 me-2"></i>
        <span className="fw-bold fs-5">Volver</span>
      </button>

      {/* Botón principal */}
      <button className="btn btn-dark px-5 py-3 fw-semibold rounded-pill mt-5 mb-5"
        onClick={handleIniciarPausar}>
        {isRunning ? "Pausar Temporizador" : "Iniciar Temporizador"}
      </button>

      {/* Círculo del timer */}
      <div className="rounded-circle border border-5 border-warning d-flex align-items-center justify-content-center mb-5 timer-circle">
        <h1 className="fw-bold text-dark">{formatearTiempo(tiempo)}</h1>
      </div>

      {/* Panel inferior */}
      <div className="bg-info text-white rounded-4 p-4 d-flex flex-wrap justify-content-around align-items-center w-75 mt-4 shadow opciones-timer">
        <button className="btn text-white fw-semibold" onClick={handleEstablecerTiempo}>
          Establecer tiempo de concentración
        </button>
        <button className="btn text-white fw-semibold" onClick={handleReiniciar}>
          Reiniciar Temporizador
        </button>
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold fs-5">Próxima micro actividad:</span>
          <div className="rounded-circle bg-warning text-dark fw-bold fs-4 d-flex align-items-center justify-content-center"
            style={{ width: "60px", height: "60px" }}>
            {proximaActividad}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
