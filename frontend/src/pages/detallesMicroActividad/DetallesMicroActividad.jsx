import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DetallesMicroActividad.css";

const DetallesMicroActividad = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Datos de ejemplo - luego vendrían de una API o estado global
  const actividades = {
    1: { 
      titulo: "Respiración profunda", 
      categoria: "Mente", 
      duracion: 2,
      tiempoConcentracion: 25,
      descripcion: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.\n\nBody text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.\n\nBody text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.\n\nBody text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
    },
    2: { 
      titulo: "Estiramientos", 
      categoria: "Cuerpo", 
      duracion: 5,
      tiempoConcentracion: 20,
      descripcion: "Realiza una serie de estiramientos suaves para relajar los músculos y mejorar la circulación. Perfecto para descansar después de largas sesiones de trabajo."
    },
    3: { 
      titulo: "Puzzle rápido", 
      categoria: "Creatividad", 
      duracion: 3,
      tiempoConcentracion: 15,
      descripcion: "Resuelve un puzzle rápido para estimular tu creatividad y agilidad mental. Ideal para despejar la mente entre tareas."
    },
    4: { 
      titulo: "Meditación 5 min", 
      categoria: "Mente", 
      duracion: 5,
      tiempoConcentracion: 25,
      descripcion: "Sesión breve de meditación guiada para reducir el estrés y aumentar tu claridad mental."
    },
    5: { 
      titulo: "Caminata corta", 
      categoria: "Cuerpo", 
      duracion: 10,
      tiempoConcentracion: 30,
      descripcion: "Da un paseo corto para activar tu cuerpo y oxigenar tu mente. Mejora la circulación y reduce la fatiga."
    },
    6: { 
      titulo: "Dibujo libre", 
      categoria: "Creatividad", 
      duracion: 7,
      tiempoConcentracion: 20,
      descripcion: "Expresa tu creatividad mediante el dibujo libre. No hay reglas, solo deja fluir tu imaginación."
    },
    7: { 
      titulo: "Ejercicios oculares", 
      categoria: "Cuerpo", 
      duracion: 2,
      tiempoConcentracion: 15,
      descripcion: "Realiza ejercicios para descansar la vista después de largas jornadas frente a la pantalla."
    },
    8: { 
      titulo: "Mindfulness", 
      categoria: "Mente", 
      duracion: 8,
      tiempoConcentracion: 30,
      descripcion: "Práctica de atención plena para conectar con el momento presente y reducir la ansiedad."
    }
  };

  const actividad = actividades[id] || actividades[1];

  const handleVolver = () => {
    navigate("/catalogo");
  };

  const handleEmpezarSesion = () => {
    navigate("/timer", {
      state: {
        tiempoConcentracion: actividad.tiempoConcentracion,
        duracionActividad: actividad.duracion,
        tituloActividad: actividad.titulo
      }
    });
  };

  return (
    <div className="detalles-actividad">
      {/* Botón Volver */}
      <button className="volver-btn" onClick={handleVolver}>
        <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="volver-text">Volver</span>
      </button>

      {/* Caja principal con título y descripción */}
      <div className="info-box">
        <h1 className="actividad-titulo">{actividad.titulo}</h1>
        <p className="actividad-descripcion">
          {actividad.descripcion.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < actividad.descripcion.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      </div>

      {/* Paso 1: Tiempo de concentración */}
      <div className="paso-box paso-1">
        <span className="paso-label">Tiempo de concentración</span>
        <span className="paso-tiempo">{actividad.tiempoConcentracion} minutos</span>
      </div>

      {/* Paso 2: Realizar micro actividad */}
      <div className="paso-box paso-2">
        <span className="paso-label">Realizar micro actividad</span>
        <span className="paso-tiempo">{actividad.duracion} minutos</span>
      </div>

      {/* Botón Empezar sesión */}
      <button className="empezar-btn" onClick={handleEmpezarSesion}>
        Empezar sesión
      </button>
    </div>
  );
};

export default DetallesMicroActividad;