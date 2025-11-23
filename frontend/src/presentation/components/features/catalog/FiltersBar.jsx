import React from 'react';
import { useFilters, useSearch } from '../../../hooks/catalog/index.js';
import './FiltersBar.css';
function FiltersBar({ className = '' }) {
  const {
    filters,
    filterOptions,
    hasActiveFilters,
    applyCategory,
    applyDuration,
    applyOrder,
    clearFilters
  } = useFilters();
  const {
    searchTerm,
    handleSearchChange,
    clearSearch,
    isWaitingForDebounce
  } = useSearch();
  const handleCategoryChange = (e) => {
    applyCategory(e.target.value);
  };
  const handleDurationChange = (e) => {
    applyDuration(e.target.value);
  };
  const handleOrderChange = (e) => {
    applyOrder(e.target.value);
  };
  const handleSearchInputChange = (e) => {
    handleSearchChange(e.target.value);
  };
  const handleClearAll = () => {
    clearFilters();
    clearSearch();
  };
  return (
    <div className={`filters-bar ${className}`}>
      {}
      <div className="filters-bar__header">
        <h2 className="filters-bar__title">Explorar Catálogo</h2>
        {hasActiveFilters && (
          <button
            className="filters-bar__clear-btn"
            onClick={handleClearAll}
            type="button"
          >
            Limpiar filtros
          </button>
        )}
      </div>
      {}
      <div className="filters-bar__controls">
        {}
        <div className="filters-bar__search-group">
          <div className="filters-bar__search-container">
            <input
              type="text"
              className="filters-bar__search-input"
              placeholder="Buscar microactividades..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              aria-label="Buscar microactividades"
            />
            <div className="filters-bar__search-icon">
              {isWaitingForDebounce ? (
                <span className="filters-bar__search-loading">⏳</span>
              ) : (
                <span>🔍</span>
              )}
            </div>
            {searchTerm && (
              <button
                className="filters-bar__search-clear"
                onClick={clearSearch}
                type="button"
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        {}
        <div className="filters-bar__filters-group">
          {}
          <div className="filters-bar__filter">
            <label htmlFor="category-filter" className="filters-bar__filter-label">
              Categoría
            </label>
            <select
              id="category-filter"
              className="filters-bar__filter-select"
              value={filters.category || 'all'}
              onChange={handleCategoryChange}
            >
              {filterOptions.categories?.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          {}
          <div className="filters-bar__filter">
            <label htmlFor="duration-filter" className="filters-bar__filter-label">
              Duración
            </label>
            <select
              id="duration-filter"
              className="filters-bar__filter-select"
              value={filters.duration || 'all'}
              onChange={handleDurationChange}
            >
              {filterOptions.durations?.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>
          {}
          <div className="filters-bar__filter">
            <label htmlFor="order-filter" className="filters-bar__filter-label">
              Ordenar por
            </label>
            <select
              id="order-filter"
              className="filters-bar__filter-select"
              value={filters.nameOrder || 'none'}
              onChange={handleOrderChange}
            >
              {filterOptions.orders?.map((order) => (
                <option key={order.value} value={order.value}>
                  {order.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {}
      {hasActiveFilters && (
        <div className="filters-bar__active-filters">
          <span className="filters-bar__active-label">Filtros activos:</span>
          <div className="filters-bar__active-list">
            {filters.category && filters.category !== 'all' && (
              <span className="filters-bar__active-tag">
                Categoría: {filters.category}
              </span>
            )}
            {filters.duration && filters.duration !== 'all' && (
              <span className="filters-bar__active-tag">
                Duración: {filterOptions.durations?.find(d => d.value === filters.duration)?.label}
              </span>
            )}
            {filters.nameOrder && filters.nameOrder !== 'none' && (
              <span className="filters-bar__active-tag">
                Orden: {filterOptions.orders?.find(o => o.value === filters.nameOrder)?.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default FiltersBar;
