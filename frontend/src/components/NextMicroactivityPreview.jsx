import React from 'react';
import { useTimer } from '../store/TimerContext';
import useRandomSelector from '../hooks/useRandomSelector';
import './NextMicroactivityPreview.css';
function NextMicroactivityPreview({ 
  className = '', 
  showDetails = true,
  onRefresh = null 
}) {
  const {
    nextMicroactivity,
    duration
  } = useTimer();
  const {
    loading,
    error,
    selectNext
  } = useRandomSelector();
  const handleRefresh = async () => {
    try {
      await selectNext();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error refrescando microactividad:', error);
    }
  };
  const getCategoryIcon = (category) => {
    const iconMap = {
      'mente': '🧠',
      'cuerpo': '🏃‍♀️',
      'respiración': '🫁',
      'meditation': '🧘‍♀️',
      'exercise': '💪',
      'mindfulness': '✨',
      'breathing': '🌬️',
      'stretching': '🤸‍♀️'
    };
    const key = category?.toLowerCase() || '';
    return iconMap[key] || '⭐';
  };
  const getCategoryColor = (category) => {
    const colorMap = {
      'mente': '#667eea',
      'cuerpo': '#06b6d4',
      'respiración': '#10b981',
      'meditation': '#8b5cf6',
      'exercise': '#ef4444',
      'mindfulness': '#f59e0b',
      'breathing': '#10b981',
      'stretching': '#06b6d4'
    };
    const key = category?.toLowerCase() || '';
    return colorMap[key] || '#667eea';
  };
  const isCompatible = () => {
    if (!nextMicroactivity) return true;
    const timerMinutes = Math.floor(duration / 60);
    const activityMinutes = nextMicroactivity.durationMinutes;
    return activityMinutes <= (timerMinutes - 2);
  };
  const getCompatibilityMessage = () => {
    if (!nextMicroactivity) return null;
    if (isCompatible()) return null;
    const timerMinutes = Math.floor(duration / 60);
    const activityMinutes = nextMicroactivity.durationMinutes;
    if (activityMinutes > timerMinutes) {
      return `⚠️ Esta actividad (${activityMinutes} min) es más larga que el timer (${timerMinutes} min)`;
    }
    return `💡 Considera aumentar el timer a ${activityMinutes + 5} minutos para esta actividad`;
  };
  if (loading) {
    return (
      <div className={`microactivity-preview ${className} loading`}>
        <div className="microactivity-preview__loading">
          <div className="microactivity-preview__spinner"></div>
          <p>Seleccionando tu próxima microactividad...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={`microactivity-preview ${className} error`}>
        <div className="microactivity-preview__error">
          <div className="microactivity-preview__error-icon">⚠️</div>
          <h3>Error cargando actividad</h3>
          <p>{error}</p>
          <button 
            className="microactivity-preview__retry"
            onClick={handleRefresh}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  if (!nextMicroactivity) {
    return (
      <div className={`microactivity-preview ${className} empty`}>
        <div className="microactivity-preview__empty">
          <div className="microactivity-preview__empty-icon">🎯</div>
          <h3>Selecciona una actividad</h3>
          <p>Se elegirá automáticamente una microactividad para cuando termine el timer.</p>
          <button 
            className="microactivity-preview__select"
            onClick={handleRefresh}
          >
            Seleccionar Actividad
          </button>
        </div>
      </div>
    );
  }
  const categoryColor = getCategoryColor(nextMicroactivity.category);
  const compatibilityMessage = getCompatibilityMessage();
  return (
    <div className={`microactivity-preview ${className} ${!isCompatible() ? 'incompatible' : ''}`}>
      {}
      <div className="microactivity-preview__header">
        <h3 className="microactivity-preview__title">
          Próxima Microactividad
        </h3>
        <button
          className="microactivity-preview__refresh"
          onClick={handleRefresh}
          aria-label="Seleccionar otra actividad aleatoriamente"
          disabled={loading}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className={loading ? 'spinning' : ''}
          >
            <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
          </svg>
        </button>
      </div>
      {}
      <div 
        className="microactivity-preview__card"
        style={{ '--category-color': categoryColor }}
      >
        {}
        <div className="microactivity-preview__category">
          <span className="microactivity-preview__category-icon">
            {getCategoryIcon(nextMicroactivity.category)}
          </span>
          <span className="microactivity-preview__category-text">
            {nextMicroactivity.category}
          </span>
        </div>
        {}
        <div className="microactivity-preview__info">
          <h4 className="microactivity-preview__activity-title">
            {nextMicroactivity.title}
          </h4>
          {showDetails && (
            <p className="microactivity-preview__description">
              {nextMicroactivity.shortDescription || nextMicroactivity.description}
            </p>
          )}
        </div>
        {}
        <div className="microactivity-preview__details">
          <div className="microactivity-preview__detail">
            <span className="microactivity-preview__detail-icon">⏱️</span>
            <span className="microactivity-preview__detail-text">
              {nextMicroactivity.durationMinutes} min
            </span>
          </div>
          {nextMicroactivity.difficulty && (
            <div className="microactivity-preview__detail">
              <span className="microactivity-preview__detail-icon">📊</span>
              <span className="microactivity-preview__detail-text">
                {nextMicroactivity.difficulty}
              </span>
            </div>
          )}
          {nextMicroactivity.isQuickActivity && (
            <div className="microactivity-preview__detail">
              <span className="microactivity-preview__detail-icon">⚡</span>
              <span className="microactivity-preview__detail-text">
                Rápida
              </span>
            </div>
          )}
        </div>
        {}
        {compatibilityMessage && (
          <div className="microactivity-preview__compatibility">
            {compatibilityMessage}
          </div>
        )}
      </div>
      {}
      <div className="microactivity-preview__footer">
        <p className="microactivity-preview__hint">
          Esta actividad se iniciará automáticamente cuando termine el timer
        </p>
      </div>
    </div>
  );
}
export default NextMicroactivityPreview;
