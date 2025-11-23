import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimer } from '../../../../store/TimerContext';
import useConcentrationTimer from '../../../../hooks/useConcentrationTimer';
import useRandomSelector from '../../../../hooks/useRandomSelector';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import EndModal from '../../../../components/EndModal';
import DurationConfigModal from '../../../../components/DurationConfigModal';
import { playEndSound } from '../../../../utils/audio';
import notificationService from '../../../../services/notificationService';
import './TimerPage.css';
function TimerPage() {
  const navigate = useNavigate();
  const {
    duration,
    isRunning,
    nextMicroactivity,
    showEndModal: contextShowEndModal, // BOOLEAN del state
    setDuration,
    setNextMicroactivity,
    resetTimer: resetTimerContext,
    hideEndModal,
    triggerEndModal // FUNCIÓN para activar el modal
  } = useTimer();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false); // FORZADO A FALSE
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [completedDuration, setCompletedDuration] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('initial');
  const [error, setError] = useState(null);
  const [isEndModalProcessed, setIsEndModalProcessed] = useState(false);
  const {
    selectNext,
    confirmSelection,
    loading: loadingMicroactivities,
    error: errorMicroactivities
  } = useRandomSelector();
  const {
    timeLeft,
    isRunning: isActive,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer: resetTimerHook,
    canStart,
    canPause,
    canResume,
    formattedTime
  } = useConcentrationTimer();
  const handleTimerComplete = useCallback((finalDuration) => {
    setCompletedDuration(finalDuration);
    setCurrentPhase('completed');
    setShowEndModal(true);
  }, []);
  const handleTimerTick = useCallback((timeRemaining) => {
    if (timeRemaining <= 60 && timeRemaining > 0) {
      setCurrentPhase('near-end');
    }
  }, []);
  const handleDurationChange = useCallback((newDuration) => {
    setDuration(newDuration * 60); // Convertir minutos a segundos
    setError(null);
  }, [setDuration]);
  const handleStartRequest = useCallback(() => {
    if (duration <= 0) {
      setError('Por favor configura una duración válida');
      return;
    }
    setShowConfirmationModal(true);
  }, [duration]);
  const handleConfirmStart = useCallback(async () => {
    try {
      setShowConfirmationModal(false);
      setCurrentPhase('running');
      setError(null);
      if (startTimer && typeof startTimer === 'function') {
        startTimer();
      } else {
        throw new Error('Función de inicio del timer no disponible');
      }
    } catch (error) {
      console.error('Error iniciando timer:', error);
      setError('Error al iniciar el timer. Por favor intenta nuevamente.');
      setCurrentPhase('ready');
    }
  }, [startTimer]);
  const handleCancelStart = useCallback(() => {
    setShowConfirmationModal(false);
  }, []);
  const handlePause = useCallback(async () => {
    try {
      await pauseTimer();
    } catch (error) {
      console.error('Error pausando timer:', error);
      setError('Error al pausar el timer');
    }
  }, [pauseTimer]);
  const handleResume = useCallback(async () => {
    try {
      await resumeTimer();
      setError(null);
    } catch (error) {
      console.error('Error reanudando timer:', error);
      setError('Error al reanudar el timer');
    }
  }, [resumeTimer]);
  const handleStop = useCallback(async () => {
    try {
      const finalDuration = duration - timeLeft;
      await stopTimer();
      setCompletedDuration(finalDuration);
      setCurrentPhase('completed');
      setShowEndModal(true);
    } catch (error) {
      console.error('Error deteniendo timer:', error);
      setError('Error al detener el timer');
    }
  }, [stopTimer, duration, timeLeft]);
  const handleReset = useCallback(async () => {
    try {
      if (typeof resetTimerHook === 'function') {
        await resetTimerHook();
      }
      setCurrentPhase('initial');
      setCompletedDuration(0);
      setError(null);
      resetTimerContext();
    } catch (error) {
      console.error('Error reseteando timer:', error);
      setError('Error al resetear el timer');
    }
  }, [resetTimerHook, resetTimerContext]);
  const handleSetDuration = useCallback((minutes) => {
    const seconds = minutes * 60;
    setDuration(seconds);
    setCurrentPhase('ready');
    setShowConfigModal(false);
    setError(null);
    if (resetTimerHook && typeof resetTimerHook === 'function') {
      resetTimerHook();
    }
  }, [setDuration, resetTimerHook]);
  const handleStartConfiguredTimer = useCallback(() => {
    if (duration > 0) {
      handleStartRequest();
    }
  }, [duration, handleStartRequest]);
  const handleStartMicroactivity = useCallback(async (microactivity) => {
    try {
      setShowEndModal(false);
      hideEndModal();
      if (microactivity && microactivity.id) {
        await confirmSelection(microactivity.id);
        navigate(`/actividad/${microactivity.id}`);
      } else {
        navigate('/catalog');
      }
    } catch (error) {
      console.error('Error iniciando microactividad:', error);
      setError('Error al iniciar la microactividad');
    }
  }, [navigate, hideEndModal, confirmSelection]);
  const handleDismissMicroactivity = useCallback(() => {
    setShowEndModal(false);
    setIsEndModalProcessed(true);
    hideEndModal();
    setCurrentPhase('initial');
  }, [hideEndModal]);
  const handleCloseEndModal = useCallback(() => {
    try {
      setShowEndModal(false);
      setIsEndModalProcessed(true);
      hideEndModal();
      setCurrentPhase('initial');
    } catch (error) {
      console.error('❌ Error cerrando modal:', error);
      setShowEndModal(false);
    }
  }, [hideEndModal]);
  const handleCloseError = useCallback(() => {
    setError(null);
  }, []);
  const handleBackToDashboard = useCallback(() => {
    if (isActive) {
      const confirmLeave = window.confirm(
        '¿Estás seguro de que quieres salir? Se perderá el progreso del timer.'
      );
      if (!confirmLeave) return;
    }
    resetTimerContext();
    navigate('/dashboard');
  }, [isActive, resetTimerContext, navigate]);
  const handleRefreshMicroactivity = useCallback(async () => {
    try {
      const selected = await selectNext();
      if (!selected) {
        const fallbackActivity = {
          id: 'fallback-' + Date.now(),
          title: 'Actividad de descanso',
          description: 'Toma un momento para relajarte',
          isTemporary: true
        };
        setNextMicroactivity(fallbackActivity);
      }
    } catch (error) {
      console.error('Error al refrescar microactividad:', error);
      setError('Error al cargar nueva actividad');
    }
  }, [selectNext, setNextMicroactivity]);
  useEffect(() => {
    setShowEndModal(false);
    setIsEndModalProcessed(false);
    setCurrentPhase('initial');
  }, []); // Empty dependency array for initialization only
  useEffect(() => {
    if (contextShowEndModal === true && !showEndModal && !isEndModalProcessed) {
      setShowEndModal(true);
      setCurrentPhase('completed');
      setCompletedDuration(duration - (timeLeft || 0));
      setIsEndModalProcessed(true);
      
      // Reproducir sonido de finalización
      playEndSound({ volume: 0.7 }).then(success => {
        if (success) {
          console.log('✅ Sonido de finalización reproducido');
        } else {
          console.warn('⚠️ No se pudo reproducir el sonido de finalización');
        }
      });
      
      // Mostrar notificación
      notificationService.showTimerEndNotification(
        nextMicroactivity?.title || null
      ).then(shown => {
        if (shown) {
          console.log('✅ Notificación de finalización mostrada');
        }
      });
    }
  }, [contextShowEndModal, showEndModal, isEndModalProcessed, duration, timeLeft, nextMicroactivity?.title]);
  useEffect(() => {
    if (!contextShowEndModal && isEndModalProcessed) {
      setIsEndModalProcessed(false);
    }
  }, [contextShowEndModal]);
  useEffect(() => {
    if (currentPhase === 'ready' && duration > 0 && !nextMicroactivity) {
      selectNext().catch(error => {
        console.error('Error al seleccionar microactividad:', error);
        const fallbackActivity = {
          id: 'fallback-ready',
          title: 'Actividad de descanso',
          description: 'Toma un breve descanso',
          isTemporary: true
        };
        setNextMicroactivity(fallbackActivity);
      });
    }
  }, [currentPhase, duration, nextMicroactivity, selectNext, setNextMicroactivity]);
  useEffect(() => {
    if (!nextMicroactivity) {
      selectNext().catch(error => {
        console.error('Error al cargar microactividad inicial:', error);
        const fallbackActivity = {
          id: 'fallback-initial',
          title: 'Actividad de descanso',
          description: 'Toma un breve descanso',
          isTemporary: true
        };
        setNextMicroactivity(fallbackActivity);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const getTimerStatus = useCallback(() => {
    if (currentPhase === 'completed') return 'completed';
    if (currentPhase === 'near-end') return 'near-end';
    if (!isActive) return 'ready';
    return isRunning ? 'running' : 'paused';
  }, [currentPhase, isActive, isRunning]);
  return (
    <div className="timer-page">
      {}
      <div className="timer-page__minimalist-container">
        {}
        <div className="timer-page__header-minimal">
          <button 
            className="timer-page__back-btn-minimal"
            onClick={handleBackToDashboard}
            disabled={isActive}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Volver
          </button>
        </div>
        {}
        <div className="timer-page__timer-section-minimal">
          <div className="timer-page__timer-circle">
            <div className="timer-page__timer-display">
              {(() => {
                if (!duration || duration <= 0) {
                  return '00:00';
                }
                if (isRunning || (isActive && timeLeft !== duration)) {
                  const minutes = Math.floor(timeLeft / 60);
                  const seconds = Math.floor(timeLeft % 60);
                  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
                const totalMinutes = Math.floor(duration / 60);
                const totalSeconds = Math.floor(duration % 60);
                return `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
              })()}
            </div>
          </div>
          {}
          {currentPhase === 'ready' && duration > 0 && (
            <button 
              className="timer-page__start-btn"
              onClick={handleStartConfiguredTimer}
            >
              Iniciar {Math.floor(duration / 60)}min
            </button>
          )}
        </div>
        {}
        <div className="timer-page__controls-bar">
          <button 
            className="timer-page__control-btn timer-page__control-btn--establish"
            onClick={() => {
              setShowConfigModal(true);
            }}
            disabled={isActive}
          >
            Establecer tiempo de concentración
          </button>
          <button 
            className="timer-page__control-btn timer-page__control-btn--reset"
            onClick={handleReset}
          >
            Reiniciar Temporizador
          </button>
        </div>
        {}
        <div className="timer-page__next-activity-card">
          <div className="timer-page__card-header">
            <h3>Próxima Microactividad</h3>
            <button className="timer-page__refresh-btn" onClick={handleRefreshMicroactivity}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
              </svg>
            </button>
          </div>
          <div className="timer-page__card-content">
            <div className="timer-page__activity-category">
              <div className="timer-page__category-icon">
                🧠
              </div>
              <span>{nextMicroactivity?.category || 'Mente'}</span>
            </div>
            <h4 className="timer-page__activity-title">
              {nextMicroactivity?.title || nextMicroactivity?.name || 'Visualización Positiva'}
            </h4>
            <p className="timer-page__activity-description">
              {nextMicroactivity?.description || 'Técnica de visualización para mejorar el estado de ánimo y la motivación.'}
            </p>
            <div className="timer-page__activity-meta">
              <div className="timer-page__duration">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                </svg>
                <span>{nextMicroactivity?.duration || '8'} min</span>
              </div>
              <div className="timer-page__difficulty">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                </svg>
                <span>{nextMicroactivity?.difficulty || 'Fácil'}</span>
              </div>
            </div>
          </div>
          <div className="timer-page__card-footer">
            <p>Esta actividad se iniciará automáticamente cuando termine el timer</p>
          </div>
        </div>
        {}
        {error && (
          <div className="timer-page__error-minimal">
            <span>{error}</span>
            <button onClick={handleCloseError}>×</button>
          </div>
        )}
      </div>
      {}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onConfirm={handleConfirmStart}
        onCancel={handleCancelStart}
        duration={duration}
        nextMicroactivity={nextMicroactivity}
      />
      {}
      <EndModal
        isOpen={showEndModal}
        onClose={handleCloseEndModal}
        onStartMicroactivity={handleStartMicroactivity}
        onDismiss={handleDismissMicroactivity}
        completedDuration={completedDuration}
        nextMicroactivity={nextMicroactivity}
      />
      {}
      <DurationConfigModal
        isOpen={showConfigModal}
        onClose={() => {
          setShowConfigModal(false);
        }}
        onSetDuration={handleSetDuration}
        currentDuration={duration}
      />
    </div>
  );
}
export default TimerPage;
