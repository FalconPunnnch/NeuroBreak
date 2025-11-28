import React from 'react';
import MicroactivityCard from './MicroactivityCard.jsx';
import './MicroactivityList.css';
function MicroactivityList({
  microactivities = [],
  loading = false,
  onCardClick,
  className = '',
  emptyMessage = 'No se encontraron microactividades',
  loadingMessage = 'Cargando microactividades...'
}) {
  if (loading) {
    return (
      <div className={`microactivity-list microactivity-list--loading ${className}`}>
        <div className="microactivity-list__loading">
          <div className="microactivity-list__spinner"></div>
          <p className="microactivity-list__loading-text">{loadingMessage}</p>
        </div>
      </div>
    );
  }
  if (!microactivities || microactivities.length === 0) {
    return (
      <div className={`microactivity-list microactivity-list--empty ${className}`}>
        <div className="microactivity-list__empty">
          <div className="microactivity-list__empty-icon">🔍</div>
          <h3 className="microactivity-list__empty-title">Sin resultados</h3>
          <p className="microactivity-list__empty-message">{emptyMessage}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`microactivity-list ${className}`}>
      <div className="microactivity-list__grid">
        {microactivities.map((microactivity) => (
          <MicroactivityCard
            key={microactivity.id}
            microactivity={microactivity}
            onClick={onCardClick}
          />
        ))}
      </div>
      {}
      <div className="microactivity-list__footer">
        <p className="microactivity-list__count">
          {microactivities.length === 1
            ? '1 microactividad encontrada'
            : `${microactivities.length} microactividades encontradas`
          }
        </p>
      </div>
    </div>
  );
}
export default MicroactivityList;
