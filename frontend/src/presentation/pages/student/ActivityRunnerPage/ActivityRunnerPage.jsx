import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ActivityProvider } from '../../../../state/contexts/ActivityContext';
import useActivityTimer from '../../../hooks/useActivityTimer';
import ActivityTimer from '../../../components/features/activity/ActivityTimer';
import EmotionModal from '../../../../components/EmotionModal';
import ActivityService from '../../../../core/services/ActivityService';
import Header from '../../../components/layout/Header/Header';
import Footer from '../../../components/layout/Footer/Footer';
import './ActivityRunnerPage.css';
function ActivityRunnerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [nextActivity, setNextActivity] = useState(null);
  const [loadingNextActivity, setLoadingNextActivity] = useState(false);
  const activityService = new ActivityService();
  const handleTimerComplete = useCallback(async (completionData) => {
    try {
      const sessionData = {
        microactivityId: activity.id,
        actualDuration: completionData.actualDuration || completionData.totalDuration,
        estimatedDuration: activity.estimatedDuration,
        completedAt: new Date(),
        sessionEvents: [],
        checkpoints: []
      };
      await activityService.recordCompletedActivity(sessionData);
      setSessionCompleted(true);
      setShowSuccessModal(true);
      await loadNextActivity();
    } catch (error) {
      console.error('Error registrando actividad completada:', error);
      setError(`Error al guardar la actividad: ${error.message}`);
    }
  }, [activity]); // ✅ Removida dependencia problemática
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setShowEmotionModal(true);
  };
  const handleMoodSelected = useCallback(async (selectedMood) => {
    try {
      console.log('📋 ActivityRunnerPage: Mood selected:', selectedMood);
      console.log('🔄 ActivityRunnerPage: Cerrando EmotionModal...');
      setShowEmotionModal(false);
      console.log('✋ ActivityRunnerPage: NO navegando - EmotionModal maneja la navegación');
    } catch (error) {
      console.error('❌ ActivityRunnerPage: Error after mood selection:', error);
      setError('Error al procesar la selección de estado emocional');
    }
  }, []);
  const handleEmotionModalClose = useCallback(() => {
    console.log('🔄 ActivityRunnerPage: handleEmotionModalClose llamado');
    setShowEmotionModal(false);
  }, []);
  const handleTimerError = useCallback((error) => {
    console.error('Error del temporizador:', error);
    setError(`Error en el temporizador: ${error.message}`);
  }, []);
  const {
    initializeTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopSession,
    timeLeft,
    progress,
    isRunning,
    sessionStatus,
    formattedTimeLeft,
    progressPercentage,
    canStart,
    canPause,
    canResume,
    canReset,
    error: timerError
  } = useActivityTimer({
    tickInterval: 1000,
    onComplete: handleTimerComplete,
    onError: handleTimerError
  });
  useEffect(() => {
    loadActivity();
  }, [id]);
  const loadNextActivity = async () => {
    try {
      setLoadingNextActivity(true);
      const currentId = activity?.id;
      if (currentId) {
        const nextId = currentId === 1 ? 2 : currentId - 1;
        try {
          const nextActivityData = await activityService.getActivityForSession(nextId);
          setNextActivity(nextActivityData);
        } catch (error) {
          console.log('No se pudo obtener próxima actividad específica');
          setNextActivity(null);
        }
      }
    } catch (error) {
      console.error('Error cargando próxima actividad:', error);
      setNextActivity(null);
    } finally {
      setLoadingNextActivity(false);
    }
  };
  const loadActivity = async () => {
    if (!id) {
      setError('ID de actividad no especificado');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const activityData = await activityService.getActivityForSession(parseInt(id));
      setActivity(activityData);
      initializeTimer(activityData, activityData.sessionConfig.timerType);
    } catch (error) {
      console.error('Error cargando actividad:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleStart = useCallback(async () => {
    try {
      await startTimer();
    } catch (error) {
      console.error('Error iniciando actividad:', error);
      setError(`Error al iniciar: ${error.message}`);
    }
  }, [startTimer]);
  const handlePause = useCallback(async () => {
    try {
      await pauseTimer();
    } catch (error) {
      console.error('Error pausando actividad:', error);
      setError(`Error al pausar: ${error.message}`);
    }
  }, [pauseTimer]);
  const handleResume = useCallback(async () => {
    try {
      await resumeTimer();
    } catch (error) {
      console.error('Error reanudando actividad:', error);
      setError(`Error al reanudar: ${error.message}`);
    }
  }, [resumeTimer]);
  const handleReset = useCallback(async () => {
    try {
      await resetTimer();
      setSessionCompleted(false);
      setShowSuccessModal(false);
      setError(null);
    } catch (error) {
      console.error('Error reiniciando actividad:', error);
      setError(`Error al reiniciar: ${error.message}`);
    }
  }, [resetTimer]);
  const handleFinish = useCallback(async () => {
    try {
      await stopSession();
      navigate('/catalog');
    } catch (error) {
      console.error('Error finalizando sesión:', error);
      navigate('/catalog');
    }
  }, [stopSession, navigate]);
  const getTimerTheme = () => {
    if (!activity?.category) return 'default';
    const category = activity.category.toLowerCase();
    if (category.includes('meditation') || category.includes('mindfulness')) {
      return 'meditation';
    }
    if (category.includes('exercise') || category.includes('movement')) {
      return 'exercise';
    }
    return 'default';
  };
  if (loading) {
    return (
      <div className="activity-runner-page">
        <Header />
        <main className="activity-runner-page__main">
          <div className="activity-runner-page__container">
            <div className="activity-runner-page__loading">
              <div className="activity-runner-page__spinner"></div>
              <h2>Cargando actividad...</h2>
              <p>Preparando tu sesión de bienestar</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  if (error && !activity) {
    return (
      <div className="activity-runner-page">
        <Header />
        <main className="activity-runner-page__main">
          <div className="activity-runner-page__container">
            <div className="activity-runner-page__error">
              <h2>No se pudo cargar la actividad</h2>
              <p>{error}</p>
              <div className="activity-runner-page__error-actions">
                <button 
                  className="btn btn--secondary"
                  onClick={() => navigate('/catalog')}
                >
                  Volver al Catálogo
                </button>
                <button 
                  className="btn btn--primary"
                  onClick={loadActivity}
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="activity-runner-page">
      <Header />
      <main className="activity-runner-page__main">
        <div className="activity-runner-page__container">
          {}
          <div className="activity-runner-page__header">
            <button 
              className="activity-runner-page__back-btn"
              onClick={() => navigate('/catalog')}
              disabled={isRunning}
            >
              <i className="fas fa-arrow-left"></i>
              Volver al Catálogo
            </button>
            <div className="activity-runner-page__breadcrumb">
              <span>Catálogo</span>
              <i className="fas fa-chevron-right"></i>
              <span>{activity?.category || 'Actividad'}</span>
              <i className="fas fa-chevron-right"></i>
              <span>{activity?.title || 'Sin título'}</span>
            </div>
          </div>
          {}
          <div className="activity-runner-page__activity-info">
            <div className="activity-runner-page__activity-header">
              <h1 className="activity-runner-page__title">
                {activity?.title}
              </h1>
              {activity?.category && (
                <span className="activity-runner-page__category">
                  {activity.category}
                </span>
              )}
            </div>
            {activity?.description && (
              <p className="activity-runner-page__description">
                {activity.description}
              </p>
            )}
            {}
            <div className="activity-runner-page__activity-details">
              {activity?.duration && (
                <div className="activity-runner-page__detail-item">
                  <i className="fas fa-clock"></i>
                  <span>Duración: {activity.duration} minutos</span>
                </div>
              )}
              {activity?.concentrationTime && (
                <div className="activity-runner-page__detail-item">
                  <i className="fas fa-brain"></i>
                  <span>Tiempo de concentración: {activity.concentrationTime} min</span>
                </div>
              )}
              {activity?.sessionConfig?.showBreathing && (
                <div className="activity-runner-page__detail-item">
                  <i className="fas fa-wind"></i>
                  <span>Incluye ejercicios de respiración</span>
                </div>
              )}
            </div>
          </div>
          {}
          <div className="activity-runner-page__timer-section">
            <ActivityTimer
              timeLeft={timeLeft}
              progress={progress}
              isRunning={isRunning}
              isPaused={sessionStatus === 'paused'}
              activity={activity}
              sessionStatus={sessionStatus}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
              onStop={handleFinish}
              showControls={true}
              size="large"
              theme={getTimerTheme()}
              breathingPhase={null} // TODO: Obtener del hook si es meditación
            />
          </div>
          {}
          {activity?.steps && activity.steps.length > 0 && (
            <div className="activity-runner-page__instructions">
              <h3>Pasos a seguir:</h3>
              <ol className="activity-runner-page__steps">
                {activity.steps.map((step, index) => (
                  <li key={index} className="activity-runner-page__step">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {}
          {(error || timerError) && (
            <div className="activity-runner-page__error-banner">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error || timerError}</span>
              <button 
                className="activity-runner-page__error-close"
                onClick={() => setError(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          {}
          {sessionStatus === 'running' && (
            <div className="activity-runner-page__progress-info">
              <div className="activity-runner-page__stats">
                <div className="activity-runner-page__stat">
                  <span className="activity-runner-page__stat-label">Tiempo restante</span>
                  <span className="activity-runner-page__stat-value">{formattedTimeLeft}</span>
                </div>
                <div className="activity-runner-page__stat">
                  <span className="activity-runner-page__stat-label">Progreso</span>
                  <span className="activity-runner-page__stat-value">{progressPercentage}%</span>
                </div>
                {activity?.duration && (
                  <div className="activity-runner-page__stat">
                    <span className="activity-runner-page__stat-label">Duración total</span>
                    <span className="activity-runner-page__stat-value">{activity.duration} min</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {}
      {showSuccessModal && (
        <div className="activity-runner-page__modal-overlay">
          <div className="activity-runner-page__modal">
            <div className="activity-runner-page__modal-content">
              <div className="activity-runner-page__success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>¡Actividad Completada!</h3>
              <p>Has completado exitosamente "{activity?.title}"</p>
              {}
              {loadingNextActivity && (
                <div className="activity-runner-page__next-activity-loading">
                  <p>Preparando próxima actividad...</p>
                </div>
              )}
              {nextActivity && !loadingNextActivity && (
                <div className="activity-runner-page__next-activity-info">
                  <p><strong>Próxima actividad sugerida:</strong></p>
                  <p>"{nextActivity.title}" - {nextActivity.category}</p>
                </div>
              )}
              <div className="activity-runner-page__modal-actions">
                <button 
                  className="btn btn--secondary"
                  onClick={handleCloseSuccessModal}
                  disabled={loadingNextActivity}
                >
                  Continuar
                </button>
                <button 
                  className="btn btn--primary"
                  onClick={handleFinish}
                >
                  Ir al Catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {}
      <EmotionModal
        isOpen={showEmotionModal}
        onClose={handleEmotionModalClose}
        onMoodSelected={handleMoodSelected}
        microactivityId={activity?.id}
        microactivityName={activity?.title}
      />
    </div>
  );
}
function ActivityRunnerPageWithProvider() {
  return (
    <ActivityProvider>
      <ActivityRunnerPage />
    </ActivityProvider>
  );
}
export default ActivityRunnerPageWithProvider;
