// Student Mood History View
// frontend/src/presentation/components/student/StudentMainContent/views/StudentMoodHistoryView.jsx

import React, { useState, useMemo } from 'react';
import { useMoodHistory } from '../../../../hooks/useStudentStats';

/**
 * Presenter Pattern: Vista del historial de estados de ánimo
 * Data Visualization: Presenta gráficos y análisis de moods
 */
const StudentMoodHistoryView = ({ loading: externalLoading = false, onRefresh = () => {} }) => {
  const [selectedRange, setSelectedRange] = useState('7d');

  const {
    moodData,
    loading,
    error,
    dateRange,
    changeDateRange,
    refreshMoodHistory
  } = useMoodHistory(selectedRange);

  // Datos mock para desarrollo
  const mockMoodData = {
    moods: [
      { id: 1, value: 5, emoji: '😊', label: 'Muy feliz', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), activity: 'Respiración Profunda' },
      { id: 2, value: 4, emoji: '😌', label: 'Relajado', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), activity: 'Estiramiento de Cuello' },
      { id: 3, value: 3, emoji: '😐', label: 'Neutral', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), activity: 'Meditación Guiada' },
      { id: 4, value: 4, emoji: '😄', label: 'Feliz', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), activity: 'Ejercicios Oculares' },
      { id: 5, value: 5, emoji: '🤗', label: 'Muy feliz', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), activity: 'Caminata Consciente' },
    ],
    statistics: {
      average: 4.2,
      distribution: { very_happy: 2, happy: 1, neutral: 1, sad: 0, very_sad: 0 },
      trend: 'improving'
    }
  };

  // Usar datos reales o mock
  const currentMoodData = moodData.moods.length > 0 ? moodData : mockMoodData;

  // Opciones de rango de fechas
  const rangeOptions = [
    { value: '7d', label: 'Última semana' },
    { value: '30d', label: 'Último mes' },
    { value: '90d', label: 'Últimos 3 meses' },
    { value: '1y', label: 'Último año' }
  ];

  // Mapeo de valores a emojis
  const moodEmojis = {
    5: { emoji: '😊', label: 'Muy feliz', color: '#10b981' },
    4: { emoji: '😄', label: 'Feliz', color: '#3b82f6' },
    3: { emoji: '😐', label: 'Neutral', color: '#f59e0b' },
    2: { emoji: '😕', label: 'Triste', color: '#ef4444' },
    1: { emoji: '😢', label: 'Muy triste', color: '#dc2626' }
  };

  // Análisis de tendencias
  const analysis = useMemo(() => {
    const moods = currentMoodData.moods;
    if (moods.length === 0) return null;

    const average = moods.reduce((sum, mood) => sum + mood.value, 0) / moods.length;
    const lastWeekMoods = moods.filter(mood => 
      new Date(mood.timestamp) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    const recentAverage = lastWeekMoods.length > 0 
      ? lastWeekMoods.reduce((sum, mood) => sum + mood.value, 0) / lastWeekMoods.length 
      : average;

    const trend = recentAverage > average + 0.5 ? 'improving' : 
                  recentAverage < average - 0.5 ? 'declining' : 'stable';

    return {
      overall: average,
      recent: recentAverage,
      trend,
      totalEntries: moods.length,
      mostCommonMood: getMostCommonMood(moods)
    };
  }, [currentMoodData.moods]);

  const getMostCommonMood = (moods) => {
    const counts = {};
    moods.forEach(mood => {
      counts[mood.value] = (counts[mood.value] || 0) + 1;
    });
    const mostCommon = Object.entries(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)[0];
    return moodEmojis[mostCommon];
  };

  const handleRangeChange = (newRange) => {
    setSelectedRange(newRange);
    changeDateRange(newRange);
  };

  const formatDate = (date) => {
    const moodDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - moodDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoy';
    if (diffDays === 2) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays - 1} días`;
    
    return moodDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getTrendIcon = () => {
    if (!analysis) return 'fas fa-minus';
    switch (analysis.trend) {
      case 'improving': return 'fas fa-trending-up';
      case 'declining': return 'fas fa-trending-down';
      default: return 'fas fa-minus';
    }
  };

  const getTrendColor = () => {
    if (!analysis) return 'text-gray-500';
    switch (analysis.trend) {
      case 'improving': return 'text-green-500';
      case 'declining': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const getTrendMessage = () => {
    if (!analysis) return 'Sin datos suficientes';
    switch (analysis.trend) {
      case 'improving': return '¡Tu estado de ánimo está mejorando!';
      case 'declining': return 'Tu estado de ánimo ha bajado últimamente';
      default: return 'Tu estado de ánimo se mantiene estable';
    }
  };

  return (
    <div className="student-mood-view">
      
      {/* Header */}
      <div className="student-mood-header">
        <div className="student-mood-header__content">
          <h2 className="student-mood-header__title">
            <i className="fas fa-smile"></i>
            Estados de Ánimo
          </h2>
          <p className="student-mood-header__subtitle">
            Analiza tu evolución emocional y patrones de bienestar
          </p>
        </div>
        
        <div className="student-mood-header__actions">
          <div className="student-mood-header__range-selector">
            {rangeOptions.map(option => (
              <button
                key={option.value}
                className={`student-mood-range-btn ${selectedRange === option.value ? 'student-mood-range-btn--active' : ''}`}
                onClick={() => handleRangeChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          <button 
            className="student-dashboard-btn student-dashboard-btn--primary"
            onClick={refreshMoodHistory}
          >
            <i className="fas fa-sync"></i>
            Actualizar
          </button>
        </div>
      </div>

      {/* Resumen y Estadísticas */}
      {analysis && (
        <div className="student-mood-summary">
          
          {/* Métricas principales */}
          <div className="student-mood-metrics">
            <div className="student-mood-metric">
              <div className="student-mood-metric__icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="student-mood-metric__content">
                <h4>Promedio General</h4>
                <div className="student-mood-metric__value">
                  <span className="student-mood-metric__number">
                    {analysis.overall.toFixed(1)}
                  </span>
                  <span className="student-mood-metric__emoji">
                    {moodEmojis[Math.round(analysis.overall)]?.emoji}
                  </span>
                </div>
              </div>
            </div>

            <div className="student-mood-metric">
              <div className="student-mood-metric__icon">
                <i className={getTrendIcon()}></i>
              </div>
              <div className="student-mood-metric__content">
                <h4>Tendencia</h4>
                <div className={`student-mood-metric__value ${getTrendColor()}`}>
                  <span className="student-mood-metric__text">
                    {getTrendMessage()}
                  </span>
                </div>
              </div>
            </div>

            <div className="student-mood-metric">
              <div className="student-mood-metric__icon">
                <i className="fas fa-heart"></i>
              </div>
              <div className="student-mood-metric__content">
                <h4>Estado Más Común</h4>
                <div className="student-mood-metric__value">
                  <span className="student-mood-metric__emoji">
                    {analysis.mostCommonMood?.emoji}
                  </span>
                  <span className="student-mood-metric__text">
                    {analysis.mostCommonMood?.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="student-mood-metric">
              <div className="student-mood-metric__icon">
                <i className="fas fa-list-check"></i>
              </div>
              <div className="student-mood-metric__content">
                <h4>Registros</h4>
                <div className="student-mood-metric__value">
                  <span className="student-mood-metric__number">
                    {analysis.totalEntries}
                  </span>
                  <span className="student-mood-metric__text">
                    entradas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de distribución */}
          <div className="student-mood-distribution">
            <h4 className="student-mood-distribution__title">
              Distribución de Estados
            </h4>
            <div className="student-mood-distribution__chart">
              {Object.entries(moodEmojis).reverse().map(([value, moodInfo]) => {
                const count = currentMoodData.moods.filter(m => m.value === parseInt(value)).length;
                const percentage = analysis.totalEntries > 0 ? (count / analysis.totalEntries) * 100 : 0;
                
                return (
                  <div key={value} className="student-mood-distribution__item">
                    <div className="student-mood-distribution__label">
                      <span className="student-mood-distribution__emoji">
                        {moodInfo.emoji}
                      </span>
                      <span className="student-mood-distribution__text">
                        {moodInfo.label}
                      </span>
                    </div>
                    <div className="student-mood-distribution__bar">
                      <div 
                        className="student-mood-distribution__fill"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: moodInfo.color 
                        }}
                      ></div>
                    </div>
                    <div className="student-mood-distribution__count">
                      {count} ({percentage.toFixed(0)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Registros */}
      <div className="student-mood-history">
        <h3 className="student-mood-history__title">
          <i className="fas fa-history"></i>
          Historial de Registros
        </h3>

        {currentMoodData.moods.length === 0 ? (
          <div className="student-mood-empty">
            <div className="student-mood-empty__icon">
              <i className="fas fa-smile-beam"></i>
            </div>
            <h4>No hay registros de estados de ánimo</h4>
            <p>
              Los estados de ánimo se registran automáticamente cuando completas una microactividad.
              ¡Comienza una actividad para crear tu primer registro!
            </p>
            <button className="student-dashboard-btn student-dashboard-btn--primary">
              <i className="fas fa-th-large"></i>
              Ir al Catálogo
            </button>
          </div>
        ) : (
          <div className="student-mood-list">
            {currentMoodData.moods
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map(mood => (
                <div key={mood.id} className="student-mood-entry">
                  
                  <div className="student-mood-entry__emoji">
                    <span style={{ color: moodEmojis[mood.value]?.color }}>
                      {mood.emoji || moodEmojis[mood.value]?.emoji}
                    </span>
                  </div>
                  
                  <div className="student-mood-entry__content">
                    <div className="student-mood-entry__header">
                      <h4 className="student-mood-entry__mood">
                        {mood.label || moodEmojis[mood.value]?.label}
                      </h4>
                      <div className="student-mood-entry__rating">
                        {[1, 2, 3, 4, 5].map(star => (
                          <i 
                            key={star}
                            className={`fas fa-star ${star <= mood.value ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="student-mood-entry__meta">
                      <span className="student-mood-entry__date">
                        <i className="fas fa-calendar"></i>
                        {formatDate(mood.timestamp)}
                      </span>
                      {mood.activity && (
                        <span className="student-mood-entry__activity">
                          <i className="fas fa-brain"></i>
                          Después de: {mood.activity}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="student-mood-entry__actions">
                    <button 
                      className="student-mood-entry__action"
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

      {/* Insights y Recomendaciones */}
      {analysis && analysis.totalEntries >= 5 && (
        <div className="student-mood-insights">
          <h3 className="student-mood-insights__title">
            <i className="fas fa-lightbulb"></i>
            Insights Personalizados
          </h3>
          
          <div className="student-mood-insights__list">
            {analysis.trend === 'improving' && (
              <div className="student-mood-insight student-mood-insight--positive">
                <div className="student-mood-insight__icon">
                  <i className="fas fa-trending-up"></i>
                </div>
                <div className="student-mood-insight__content">
                  <h4>¡Excelente progreso!</h4>
                  <p>Tu estado de ánimo ha mejorado consistentemente. Las actividades de bienestar están funcionando muy bien para ti.</p>
                </div>
              </div>
            )}
            
            {analysis.overall >= 4 && (
              <div className="student-mood-insight student-mood-insight--success">
                <div className="student-mood-insight__icon">
                  <i className="fas fa-smile-beam"></i>
                </div>
                <div className="student-mood-insight__content">
                  <h4>Excelente bienestar</h4>
                  <p>Mantienes un estado de ánimo muy positivo. ¡Sigue con tu rutina actual!</p>
                </div>
              </div>
            )}
            
            <div className="student-mood-insight student-mood-insight--suggestion">
              <div className="student-mood-insight__icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="student-mood-insight__content">
                <h4>Mantén la consistencia</h4>
                <p>Realizar actividades regularmente te ayuda a mantener un mejor estado de ánimo general.</p>
                <button className="student-mood-insight__action">
                  Ver Mi Calendario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentMoodHistoryView;