import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Timer.css";

const Timer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener datos de la actividad desde la navegación
  const { tiempoConcentracion = 25, duracionActividad = 5, tituloActividad = "" } = location.state || {};
  
  const [tiempo, setTiempo] = useState(tiempoConcentracion * 60); // Convertir minutos a segundos
  const [isRunning, setIsRunning] = useState(false);
  const [proximaActividad, setProximaActividad] = useState(3);

  // Formatear tiempo en MM:SS
  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  };

  // Efecto para el countdown
  useEffect(() => {
    let intervalo;
    if (isRunning && tiempo > 0) {
      intervalo = setInterval(() => {
        setTiempo((prev) => prev - 1);
      }, 1000);
    } else if (tiempo === 0) {
      setIsRunning(false);
      // Aquí podrías mostrar una notificación o redirigir
      alert("¡Tiempo completado! Hora de tu microactividad.");
    }
    return () => clearInterval(intervalo);
  }, [isRunning, tiempo]);

  const handleIniciarPausar = () => {
    setIsRunning(!isRunning);
  };

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

  const handleVolver = () => {
    navigate(-1);
  };

  return (
    <div className="timer-page">
      {/* Botón Volver */}
      <button className="volver-btn-timer" onClick={handleVolver}>
        <svg className="arrow-icon-timer" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="volver-text-timer">Volver</span>
      </button>

      {/* Botón Iniciar/Pausar */}
      <button className="iniciar-btn" onClick={handleIniciarPausar}>
        {isRunning ? "Pausar Temporizador" : "Iniciar Temporizador"}
      </button>

      {/* Círculo con tiempo */}
      <div className="timer-circle">
        <div className="timer-display">{formatearTiempo(tiempo)}</div>
      </div>

      {/* Opciones inferiores */}
      <div className="opciones-timer">
        <button className="opcion-btn" onClick={handleEstablecerTiempo}>
          Establecer tiempo de concentración
        </button>
        <button className="opcion-btn" onClick={handleReiniciar}>
          Reiniciar Temporizador
        </button>
        <div className="proxima-actividad">
          <span className="proxima-text">Próxima micro actividad:</span>
          <div className="proxima-numero">{proximaActividad}</div>
        </div>
      </div>
    </div>
  );
};

export default Timer;