import React, { useEffect, useState } from 'react';
import './ActivityTimer.css';
function ActivityTimer({ 
  timeLeft = 0,
  progress = 0,
  isRunning = false,
  isPaused = false,
  activity = null,
  sessionStatus = 'idle',
  onStart,
  onPause,
  onResume,
  onReset,
  onStop,
  showControls = true,
  size = 'large',
  theme = 'default',
  breathingPhase = null // Para timer de meditación
}) {
  const [animationClass, setAnimationClass] = useState('');
  const [displayTimeLeft, setDisplayTimeLeft] = useState(timeLeft);
  useEffect(() => {
    if (Math.abs(displayTimeLeft - timeLeft) > 1) {
      setDisplayTimeLeft(timeLeft);
    } else {
      const interval = setInterval(() => {
        setDisplayTimeLeft(current => {
          const diff = timeLeft - current;
          if (Math.abs(diff) < 0.1) return timeLeft;
          return current + diff * 0.1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [timeLeft]);
  useEffect(() => {
    if (sessionStatus === 'completed') {
      setAnimationClass('timer-completed');
    } else if (isPaused) {
      setAnimationClass('timer-paused');
    } else if (isRunning) {
      setAnimationClass('timer-running');
    } else {
      setAnimationClass('');
    }
  }, [sessionStatus, isPaused, isRunning]);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const getProgressColor = () => {
    if (sessionStatus === 'completed') return '#EDC04E';
    if (isPaused) return '#93BDCC';
    if (timeLeft <= 30) return '#e74c3c'; // Rojo para últimos 30 segundos
    if (timeLeft <= 60) return '#f39c12'; // Naranja para último minuto
    return '#EDC04E'; // Dorado normal
  };
  const renderProgressCircle = () => {
    const radius = size === 'large' ? 90 : size === 'medium' ? 70 : 50;
    const strokeWidth = size === 'large' ? 8 : size === 'medium' ? 6 : 4;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - progress);
    return (
      <svg 
        className={`timer__progress-circle ${animationClass}`}
        width={(radius + strokeWidth) * 2} 
        height={(radius + strokeWidth) * 2}
      >
        {}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke="#e9ecef"
          strokeWidth={strokeWidth}
        />
        {}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="timer__progress-stroke"
          style={{
            transition: isPaused ? 'none' : 'stroke-dashoffset 0.5s ease-in-out',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center'
          }}
        />
        {}
        <text
          x={radius + strokeWidth}
          y={radius + strokeWidth}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`timer__time-text timer__time-text--${size}`}
          fill={getProgressColor()}
        >
          {formatTime(displayTimeLeft)}
        </text>
        {}
        {size === 'large' && (
          <text
            x={radius + strokeWidth}
            y={radius + strokeWidth + (size === 'large' ? 25 : 20)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="timer__percentage-text"
            fill="#718096"
          >
            {Math.round(progress * 100)}%
          </text>
        )}
      </svg>
    );
  };
  const renderBreathingIndicator = () => {
    if (!breathingPhase) return null;
    const breathingTexts = {
      inhale: 'Inhala',
      hold: 'Mantén',
      exhale: 'Exhala',
      pause: 'Pausa'
    };
    return (
      <div className={`timer__breathing-indicator timer__breathing-indicator--${breathingPhase}`}>
        <div className="timer__breathing-circle"></div>
        <span className="timer__breathing-text">
          {breathingTexts[breathingPhase]}
        </span>
      </div>
    );
  };
  const renderControls = () => {
    if (!showControls) return null;
    return (
      <div className="timer__controls">
        {sessionStatus === 'idle' && (
          <button 
            className="btn btn--primary timer__control-btn"
            onClick={onStart}
            disabled={!activity}
          >
            <i className="fas fa-play"></i>
            Iniciar
          </button>
        )}
        {isRunning && (
          <button 
            className="btn btn--secondary timer__control-btn"
            onClick={onPause}
          >
            <i className="fas fa-pause"></i>
            Pausar
          </button>
        )}
        {isPaused && (
          <button 
            className="btn btn--primary timer__control-btn"
            onClick={onResume}
          >
            <i className="fas fa-play"></i>
            Continuar
          </button>
        )}
        {(isRunning || isPaused) && (
          <button 
            className="btn btn--danger timer__control-btn"
            onClick={onReset}
          >
            <i className="fas fa-redo"></i>
            Reiniciar
          </button>
        )}
        {sessionStatus === 'completed' && (
          <button 
            className="btn btn--success timer__control-btn"
            onClick={onStop}
          >
            <i className="fas fa-check"></i>
            Finalizar
          </button>
        )}
      </div>
    );
  };
  const renderActivityInfo = () => {
    if (!activity || size === 'large') return null;
    return (
      <div className="timer__activity-info">
        <h3 className="timer__activity-title">
          {activity.title}
        </h3>
        {activity.category && (
          <span className="timer__activity-category">
            {activity.category}
          </span>
        )}
      </div>
    );
  };
  const renderSessionStatus = () => {
    const statusTexts = {
      idle: 'Listo para comenzar',
      running: 'En progreso',
      paused: 'Pausado',
      completed: '¡Completado!',
      failed: 'Interrumpido'
    };
    const statusIcons = {
      idle: 'fas fa-clock',
      running: 'fas fa-play-circle',
      paused: 'fas fa-pause-circle',
      completed: 'fas fa-check-circle',
      failed: 'fas fa-exclamation-circle'
    };
    return (
      <div className={`timer__status timer__status--${sessionStatus}`}>
        <i className={statusIcons[sessionStatus]}></i>
        <span>{statusTexts[sessionStatus]}</span>
      </div>
    );
  };
  return (
    <div className={`activity-timer activity-timer--${size} activity-timer--${theme} ${animationClass}`}>
      {}
      {renderActivityInfo()}
      {}
      <div className="timer__progress-container">
        {renderProgressCircle()}
        {}
        {breathingPhase && renderBreathingIndicator()}
      </div>
      {}
      {renderSessionStatus()}
      {}
      {renderControls()}
      {}
      {size === 'large' && activity && (
        <div className="timer__additional-info">
          {activity.estimatedDuration && (
            <div className="timer__duration-info">
              <small>
                Duración estimada: {activity.estimatedDuration >= 60 
                  ? `${Math.floor(activity.estimatedDuration / 60)} min`
                  : `${activity.estimatedDuration} seg`
                }
              </small>
            </div>
          )}
          {sessionStatus === 'running' && (
            <div className="timer__progress-text">
              <small>
                Tiempo restante: {formatTime(timeLeft)}
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default ActivityTimer;
