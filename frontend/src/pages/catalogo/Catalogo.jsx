import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLogin from "../../components/header/HeaderLogin";
import "./Catalogo.css";

const Catalogo = () => {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState("Todas");
  const [duracion, setDuracion] = useState("Cualquier duración");
  const [busqueda, setBusqueda] = useState("");
  const [favoritos, setFavoritos] = useState({});

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

  const toggleFavorito = (id) =>
    setFavoritos((prev) => ({ ...prev, [id]: !prev[id] }));

  const actividadesFiltradas = microactividades.filter((actividad) => {
    const cumpleCategoria = categoria === "Todas" || actividad.categoria === categoria;
    const cumpleDuracion =
      duracion === "Corta (1-3 min)" ? actividad.duracion <= 3 :
      duracion === "Media (4-7 min)" ? actividad.duracion >= 4 && actividad.duracion <= 7 :
      duracion === "Larga (8+ min)" ? actividad.duracion >= 8 : true;
    const cumpleBusqueda = actividad.titulo.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleCategoria && cumpleDuracion && cumpleBusqueda;
  });

  return (
    <div className="catalogo-page bg-white min-vh-100">
      <HeaderLogin />

      <div className="container py-5">
        <h1 className="text-center fw-bold mb-5 text-dark">Microactividades</h1>

        {/* Controles */}
        <div className="row g-3 justify-content-center mb-4">
          <div className="col-md-3 col-sm-6">
            <label className="form-label fw-semibold text-dark">Categoría:</label>
            <select className="form-select custom-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option>Todas</option>
              <option>Mente</option>
              <option>Cuerpo</option>
              <option>Creatividad</option>
            </select>
          </div>

          <div className="col-md-3 col-sm-6">
            <label className="form-label fw-semibold text-dark">Duración:</label>
            <select className="form-select custom-select"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
            >
              <option>Cualquier duración</option>
              <option>Corta (1-3 min)</option>
              <option>Media (4-7 min)</option>
              <option>Larga (8+ min)</option>
            </select>
          </div>

          <div className="col-md-4 col-sm-8">
            <label className="form-label fw-semibold text-dark">Búsqueda:</label>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Nombre de actividad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Contador */}
        <div className="text-center text-secondary mb-4">
          {actividadesFiltradas.length}{" "}
          {actividadesFiltradas.length === 1 ? "actividad encontrada" : "actividades encontradas"}
        </div>

        {/* Grid */}
        <div className="row g-4">
          {actividadesFiltradas.length > 0 ? (
            actividadesFiltradas.map((act) => (
              <div key={act.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="card h-100 shadow-sm border-0 rounded-4 p-3 card-actividad">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-dark mb-0">{act.titulo}</h5>
                    <button
                      className="btn p-0 favorite-btn"
                      onClick={() => toggleFavorito(act.id)}
                    >
                      <span className={`favorite-icon ${favoritos[act.id] ? "favorito-activo" : ""}`}>
                        {favoritos[act.id] ? "⭐" : "☆"}
                      </span>
                    </button>
                  </div>

                  <div className="mb-2 d-flex gap-2 flex-wrap">
                    <span className="badge rounded-pill bg-warning text-white fw-semibold">{act.categoria}</span>
                    <span className="badge rounded-pill bg-info text-white fw-semibold">
                      {act.duracion} min
                    </span>
                  </div>

                  <p className="text-muted small flex-grow-1">
                    Ejemplo de descripción breve para la microactividad.
                  </p>

                  <button
                    className="btn btn-info text-white fw-semibold rounded-3 mt-auto"
                    onClick={() => navigate(`/actividad/${act.id}`)}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <p className="text-muted fs-5 mb-3">No se encontraron actividades con los filtros seleccionados.</p>
              <button
                className="btn btn-warning text-white fw-semibold"
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
