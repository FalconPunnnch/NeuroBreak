import React, { useState } from "react";
import "./Catalogo.css";
import HeaderLogin from "../../components/header/HeaderLogin";
import { useNavigate } from "react-router-dom";

const Catalogo = () => {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState("Todas");
  const [duracion, setDuracion] = useState("Cualquier duración");
  const [busqueda, setBusqueda] = useState("");

  // Estado para manejar favoritos - TODOS EMPIEZAN EN FALSE (vacíos)
  const [favoritos, setFavoritos] = useState({});

  // Datos de ejemplo de microactividades
  const microactividades = [
    { id: 1, titulo: "Respiración profunda", categoria: "Mente", duracion: 2 },
    { id: 2, titulo: "Estiramientos", categoria: "Cuerpo", duracion: 5 },
    { id: 3, titulo: "Puzzle rápido", categoria: "Creatividad", duracion: 3 },
    { id: 4, titulo: "Meditación 5 min", categoria: "Mente", duracion: 5 },
    { id: 5, titulo: "Caminata corta", categoria: "Cuerpo", duracion: 10 },
    { id: 6, titulo: "Dibujo libre", categoria: "Creatividad", duracion: 7 },
    { id: 7, titulo: "Ejercicios oculares", categoria: "Cuerpo", duracion: 2 },
    { id: 8, titulo: "Mindfulness", categoria: "Mente", duracion: 8 },
  ];

  // Función para toggle favorito
  const toggleFavorito = (id) => {
    setFavoritos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Función de filtrado
  const actividadesFiltradas = microactividades.filter((actividad) => {
    const cumpleCategoria = categoria === "Todas" || actividad.categoria === categoria;

    let cumpleDuracion = true;
    if (duracion === "Corta (1-3 min)") {
      cumpleDuracion = actividad.duracion >= 1 && actividad.duracion <= 3;
    } else if (duracion === "Media (4-7 min)") {
      cumpleDuracion = actividad.duracion >= 4 && actividad.duracion <= 7;
    } else if (duracion === "Larga (8+ min)") {
      cumpleDuracion = actividad.duracion >= 8;
    }

    const cumpleBusqueda = actividad.titulo.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleCategoria && cumpleDuracion && cumpleBusqueda;
  });

  return (
    <div className="catalogo-page">
      <HeaderLogin />

      <div className="catalogo-content">
        <h1 className="catalogo-title">Microactividades</h1>

        {/* Controles superiores */}
        <div className="catalogo-controls">
          <div className="control-group">
            <span className="control-label">Categoría:</span>
            <select 
              className="control-select" 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option>Todas</option>
              <option>Mente</option>
              <option>Cuerpo</option>
              <option>Creatividad</option>
            </select>
          </div>

          <div className="control-group">
            <span className="control-label">Duración:</span>
            <select 
              className="control-select" 
              value={duracion} 
              onChange={(e) => setDuracion(e.target.value)}
            >
              <option>Cualquier duración</option>
              <option>Corta (1-3 min)</option>
              <option>Media (4-7 min)</option>
              <option>Larga (8+ min)</option>
            </select>
          </div>

          <div className="control-group">
            <span className="control-label">Búsqueda:</span>
            <input
              type="text"
              className="control-input"
              placeholder="Nombre de actividad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="resultados-count">
          {actividadesFiltradas.length} {actividadesFiltradas.length === 1 ? 'actividad encontrada' : 'actividades encontradas'}
        </div>

        {/* Grid de microactividades */}
        <div className="microactividades-grid">
          {actividadesFiltradas.length > 0 ? (
            actividadesFiltradas.map((actividad) => (
              <div key={actividad.id} className="microactividad-card">
                <div className="card-header">
                  <h3 className="card-title">{actividad.titulo}</h3>
                  <button 
                    className="favorite-btn"
                    onClick={() => toggleFavorito(actividad.id)}
                    aria-label={favoritos[actividad.id] ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    <span className={`favorite-icon ${favoritos[actividad.id] ? 'favorito-activo' : ''}`}>
                      {favoritos[actividad.id] ? '⭐' : '☆'}
                    </span>
                  </button>
                </div>
                <div className="card-tags">
                  <span className="card-category">{actividad.categoria}</span>
                  <span className="card-duration">{actividad.duracion} min</span>
                </div>
                <p className="card-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <button className="card-button" onClick={() => navigate(`/actividad/${actividad.id}`)} > Ver detalles </button>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No se encontraron actividades con los filtros seleccionados.</p>
              <button 
                className="reset-btn"
                onClick={() => {
                  setCategoria("Todas");
                  setDuracion("Cualquier duración");
                  setBusqueda("");
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogo;