import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTimer } from 'contexts/TimerContext';
import { playEndSound } from 'utils/audio';
import './EndModal.css';
function EndModal({ 
  isOpen = false, 
  onClose = () => {}, 
  onStartMicroactivity = () => {},
  onDismiss = () => {},
  completedDuration = 0,
  nextMicroactivity = null,
  className = ''
}) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const modalRef = useRef(null);
  const primaryButtonRef = useRef(null);
  const secondaryButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const { resetTimer } = useTimer();
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const getCelebrationMessage = () => {
    const minutes = Math.floor(completedDuration / 60);
    if (minutes >= 60) {
      return "¡Increíble! Una hora completa de concentración 🏆";
    } else if (minutes >= 45) {
      return "¡Excelente! Sesión de concentración profunda 🌟";
    } else if (minutes >= 30) {
      return "¡Fantástico! Gran sesión de productividad 🚀";
    } else if (minutes >= 15) {
      return "¡Bien hecho! Tiempo de concentración logrado ✨";
    } else {
      return "¡Completado! Cada minuto cuenta 💪";
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      console.log('🔧 ESC key pressed in EndModal');
      event.preventDefault();
      event.stopPropagation();
      handleClose();
      return;
    }
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };
  const handleStartMicroactivity = async () => {
    if (!nextMicroactivity || isLaunching) return;
    setIsLaunching(true);
    try {
      await onStartMicroactivity(nextMicroactivity);
      resetTimer();
      onClose();
    } catch (error) {
      console.error('Error iniciando microactividad:', error);
    } finally {
      setIsLaunching(false);
    }
  };
  const handleDismiss = () => {
    if (isLaunching) return;
    try {
      onDismiss();
      onClose();
    } catch (error) {
      console.error('Error en dismiss:', error);
      onClose();
    }
  };
  const handleClose = () => {
    if (isLaunching) return;
    try {
      onClose();
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  };
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  useEffect(() => {
    if (isOpen) {
      setShowCelebration(true);
      
      // Reproducir sonido de celebración
      playEndSound({ 
        volume: 0.3,
        type: 'embedded' // Usar sonido embebido para mayor compatibilidad
      }).then(success => {
        if (!success) {
          console.log('🔔 Sonido de finalización no reproducido, usando fallback');
        }
      }).catch(error => {
        console.warn('Error reproduciendo sonido:', error);
      });
      
      const timer = setTimeout(() => {
        primaryButtonRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowCelebration(false);
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow || 'auto';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);
  if (!isOpen) return null;
  return createPortal(
    <div 
      className={`end-modal ${className} ${showCelebration ? 'celebrating' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="end-modal-title"
      aria-describedby="end-modal-description"
      onClick={handleBackdropClick}
    >
      {}
      <div 
        className="end-modal__backdrop"
      />
      {}
      <div 
        className="end-modal__content"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {}
        <div className="end-modal__celebration">
          <div className="end-modal__celebration-emoji">🎉</div>
          <div className="end-modal__celebration-particles">
            <span>✨</span>
            <span>🌟</span>
            <span>⭐</span>
            <span>💫</span>
            <span>🎊</span>
            <span>🎈</span>
          </div>
        </div>
        {}
        <div className="end-modal__header">
          <h2 
            id="end-modal-title"
            className="end-modal__title"
          >
            ¡Sesión Completada!
          </h2>
          <button
            ref={closeButtonRef}
            className="end-modal__close"
            onClick={handleClose}
            aria-label="Cerrar modal"
            disabled={isLaunching}
            style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              zIndex: 9999,
              background: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
        {}
        <div className="end-modal__body">
          {}
          <div className="end-modal__congratulations">
            <p className="end-modal__congratulations-message">
              {getCelebrationMessage()}
            </p>
            <div className="end-modal__stats">
              <span className="end-modal__stats-icon">⏱️</span>
              <span className="end-modal__stats-text">
                Concentración completada: <strong>{formatDuration(completedDuration)}</strong>
              </span>
            </div>
          </div>
          {}
          <p 
            id="end-modal-description"
            className="end-modal__description"
          >
            {nextMicroactivity ? (
            <>
            Tu sesión de concentración ha terminado exitosamente.
            <br />
            ¡Excelente trabajo!
            </>
            ) : (
            "Tu sesión de concentración ha terminado exitosamente. ¡Excelente trabajo!"
            )}
          </p>
          {}
          {nextMicroactivity && (
            <div className="end-modal__microactivity">
              <h3 className="end-modal__microactivity-title">
                Microactividad Sugerida:
              </h3>
              <div className="end-modal__microactivity-card">
                <div className="end-modal__microactivity-info">
                  <div className="end-modal__microactivity-header">
                    <span className="end-modal__microactivity-icon">
                      {nextMicroactivity.category === 'mente' && '🧠'}
                      {nextMicroactivity.category === 'cuerpo' && '🏃‍♀️'}
                      {nextMicroactivity.category === 'respiración' && '🫁'}
                    </span>
                    <h4 className="end-modal__microactivity-name">
                      {nextMicroactivity.title}
                    </h4>
                  </div>
                  <p className="end-modal__microactivity-description">
                    {nextMicroactivity.shortDescription || nextMicroactivity.description}
                  </p>
                  <div className="end-modal__microactivity-details">
                    <span className="end-modal__microactivity-duration">
                      ⏱️ {nextMicroactivity.durationMinutes} min
                    </span>
                    <span className="end-modal__microactivity-category">
                      📂 {nextMicroactivity.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {}
        <div className="end-modal__footer">
          {nextMicroactivity ? (
            <>
              <button
                ref={secondaryButtonRef}
                className="end-modal__button end-modal__button--secondary"
                onClick={handleDismiss}
                disabled={isLaunching}
              >
                <span className="end-modal__button-icon">☕</span>
                Nueva Concentración
              </button>
              <button
                ref={primaryButtonRef}
                className={`
                  end-modal__button 
                  end-modal__button--primary
                  ${isLaunching ? 'end-modal__button--loading' : ''}
                `}
                onClick={handleStartMicroactivity}
                disabled={isLaunching}
              >
                {isLaunching ? (
                  <>
                    <span className="end-modal__button-spinner"></span>
                    Iniciando...
                  </>
                ) : (
                  <>
                    <span className="end-modal__button-icon">🚀</span>
                    Iniciar Microactividad
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              ref={primaryButtonRef}
              className="end-modal__button end-modal__button--primary"
              onClick={handleClose}
            >
              <span className="end-modal__button-icon">👍</span>
              ¡Perfecto!
            </button>
          )}
        </div>
        {}
        <div className="end-modal__accessibility-hint">
          <p>Presiona ESC para cerrar o TAB para navegar</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
export default EndModal;
