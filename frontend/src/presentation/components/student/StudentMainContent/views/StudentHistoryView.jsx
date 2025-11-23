import React, { useState, useMemo } from 'react';
import { useActivityHistory } from '../../../../hooks/useStudentStats';
const StudentHistoryView = ({ loading: externalLoading = false, onRefresh = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const {
    history,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    goToPage,
    refreshHistory
  } = useActivityHistory();
  const mockActivities = [
    {
      id: 1,
      title: 'Respiración Profunda',
      category: 'Respiración',
      duration: 5,
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      mood: { emoji: '😊', label: 'Feliz' },
      difficulty: 'Fácil'
    },
    {
      id: 2,
      title: 'Estiramiento de Cuello',
      category: 'Movimiento',
      duration: 3,
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
      mood: { emoji: '😌', label: 'Relajado' },
      difficulty: 'Fácil'
    },
    {
      id: 3,
      title: 'Meditación Guiada',
      category: 'Mindfulness',
      duration: 10,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
      mood: { emoji: '🧘', label: 'Zen' },
      difficulty: 'Medio'
    },
    {
      id: 4,
      title: 'Ejercicios Oculares',
      category: 'Vista',
      duration: 2,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
      mood: { emoji: '😄', label: 'Energizado' },
      difficulty: 'Fácil'
    }
  ];
  const activities = history.activities.length > 0 ? history.activities : mockActivities;
  const filteredActivities = useMemo(() => {
    let filtered = [...activities];
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter(activity => activity.category === categoryFilter);
    }
    if (dateFilter) {
      const now = new Date();
      const filterDate = new Date(now);
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(activity => 
            new Date(activity.completedAt) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(activity => 
            new Date(activity.completedAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(activity => 
            new Date(activity.completedAt) >= filterDate
          );
          break;
      }
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.completedAt) - new Date(a.completedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          return b.duration - a.duration;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
    return filtered;
  }, [activities, searchTerm, categoryFilter, dateFilter, sortBy]);
  const uniqueCategories = useMemo(() => {
    const categories = activities.map(activity => activity.category);
    return [...new Set(categories)];
  }, [activities]);
  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setDateFilter('');
    setSortBy('date');
    clearFilters();
  };
  const formatDate = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffTime = Math.abs(now - activityDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Hoy';
    if (diffDays === 2) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays - 1} días`;
    return activityDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: activityDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'fácil': return 'success';
      case 'medio': return 'warning';
      case 'difícil': return 'danger';
      default: return 'secondary';
    }
  };
  return (
    <div className="student-history-view">
      {}
      <div className="student-history-header">
        <div className="student-history-header__content">
          <h2 className="student-history-header__title">
            <i className="fas fa-clock"></i>
            Historial de Actividades
          </h2>
          <p className="student-history-header__subtitle">
            {filteredActivities.length} actividad{filteredActivities.length !== 1 ? 'es' : ''} 
            {searchTerm || categoryFilter || dateFilter ? ' (filtrada' + (filteredActivities.length !== 1 ? 's' : '') + ')' : ''}
          </p>
        </div>
        <div className="student-history-header__actions">
          <button 
            className="student-dashboard-btn student-dashboard-btn--outline"
            onClick={handleClearFilters}
            disabled={!searchTerm && !categoryFilter && !dateFilter && sortBy === 'date'}
          >
            <i className="fas fa-filter-circle-xmark"></i>
            Limpiar Filtros
          </button>
          <button 
            className="student-dashboard-btn student-dashboard-btn--primary"
            onClick={refreshHistory}
          >
            <i className="fas fa-sync"></i>
            Actualizar
          </button>
        </div>
      </div>
      {}
      <div className="student-history-filters">
        <div className="student-history-filters__row">
          {}
          <div className="student-history-filter">
            <label>Buscar</label>
            <div className="student-history-filter__input-wrapper">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar por título o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="student-history-filter__input"
              />
            </div>
          </div>
          {}
          <div className="student-history-filter">
            <label>Categoría</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="student-history-filter__select"
            >
              <option value="">Todas las categorías</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {}
          <div className="student-history-filter">
            <label>Período</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="student-history-filter__select"
            >
              <option value="">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>
          {}
          <div className="student-history-filter">
            <label>Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="student-history-filter__select"
            >
              <option value="date">Fecha (más reciente)</option>
              <option value="title">Título (A-Z)</option>
              <option value="duration">Duración (mayor)</option>
              <option value="category">Categoría (A-Z)</option>
            </select>
          </div>
        </div>
      </div>
      {}
      <div className="student-history-content">
        {filteredActivities.length === 0 ? (
          <div className="student-history-empty">
            <div className="student-history-empty__icon">
              <i className="fas fa-history"></i>
            </div>
            <h3>No se encontraron actividades</h3>
            <p>
              {searchTerm || categoryFilter || dateFilter 
                ? 'Intenta ajustar los filtros para ver más resultados'
                : '¡Comienza tu primera actividad para ver tu historial aquí!'
              }
            </p>
            {searchTerm || categoryFilter || dateFilter ? (
              <button 
                className="student-dashboard-btn student-dashboard-btn--outline"
                onClick={handleClearFilters}
              >
                Limpiar Filtros
              </button>
            ) : (
              <button className="student-dashboard-btn student-dashboard-btn--primary">
                <i className="fas fa-th-large"></i>
                Explorar Catálogo
              </button>
            )}
          </div>
        ) : (
          <div className="student-history-list">
            {filteredActivities.map(activity => (
              <div key={activity.id} className="student-history-item">
                <div className="student-history-item__icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="student-history-item__content">
                  <div className="student-history-item__header">
                    <h4 className="student-history-item__title">{activity.title}</h4>
                    <div className="student-history-item__badges">
                      <span className="student-history-item__category">
                        {activity.category}
                      </span>
                      <span className={`student-history-item__difficulty student-history-item__difficulty--${getDifficultyColor(activity.difficulty)}`}>
                        {activity.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="student-history-item__meta">
                    <span className="student-history-item__date">
                      <i className="fas fa-calendar"></i>
                      {formatDate(activity.completedAt)}
                    </span>
                    <span className="student-history-item__duration">
                      <i className="fas fa-clock"></i>
                      {activity.duration} min
                    </span>
                    {activity.mood && (
                      <span className="student-history-item__mood">
                        <span className="student-history-item__mood-emoji">
                          {activity.mood.emoji}
                        </span>
                        {activity.mood.label}
                      </span>
                    )}
                  </div>
                </div>
                <div className="student-history-item__actions">
                  <button 
                    className="student-history-item__action"
                    title="Repetir actividad"
                  >
                    <i className="fas fa-redo"></i>
                  </button>
                  <button 
                    className="student-history-item__action"
                    title="Ver detalles"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {}
      {history.totalPages > 1 && (
        <div className="student-history-pagination">
          <button 
            className="student-history-pagination__btn"
            onClick={() => goToPage(history.currentPage - 1)}
            disabled={history.currentPage <= 1}
          >
            <i className="fas fa-chevron-left"></i>
            Anterior
          </button>
          <span className="student-history-pagination__info">
            Página {history.currentPage} de {history.totalPages}
          </span>
          <button 
            className="student-history-pagination__btn"
            onClick={() => goToPage(history.currentPage + 1)}
            disabled={history.currentPage >= history.totalPages}
          >
            Siguiente
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};
export default StudentHistoryView;
