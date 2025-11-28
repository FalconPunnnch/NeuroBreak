import { useEffect, useRef, useCallback } from 'react';
import { useActivity, ACTION_TYPES } from 'contexts/ActivityContext';
import { TimerStrategyFactory } from 'patterns/strategies/TimerStrategy';
export function useActivityTimer(options = {}) {
  const { state, dispatch } = useActivity();
  const timerStrategyRef = useRef(null);
  const configRef = useRef(options);
  useEffect(() => {
    configRef.current = { ...configRef.current, ...options };
  }, [options]);
  const initializeTimer = useCallback((activity, timerType = 'countdown') => {
    try {
      if (timerStrategyRef.current) {
        timerStrategyRef.current.destroy();
      }
      timerStrategyRef.current = TimerStrategyFactory.create(timerType);
      dispatch({
        type: ACTION_TYPES.SET_CURRENT_ACTIVITY,
        payload: activity
      });
      const duration = activity.estimatedDuration || activity.duration || 300;
      dispatch({
        type: ACTION_TYPES.SET_TIMER_DURATION,
        payload: duration
      });
    } catch (error) {
      console.error('Error inicializando temporizador:', error);
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: `Error al inicializar temporizador: ${error.message}`
      });
    }
  }, [dispatch]);
  const startTimer = useCallback(() => {
    if (!timerStrategyRef.current || !state.currentActivity) {
      return;
    }
    try {
      const timerConfig = {
        duration: state.timer.duration,
        interval: configRef.current.tickInterval || 1000,
        ...getActivitySpecificConfig(state.currentActivity)
      };
      const onTick = (timerState) => {
        dispatch({
          type: ACTION_TYPES.UPDATE_TIMER,
          payload: {
            timeLeft: timerState.timeLeft,
            progress: timerState.progress
          }
        });
        if (timerState.elapsedTime > 0 && timerState.elapsedTime % 60 === 0) {
          dispatch({
            type: ACTION_TYPES.ADD_CHECKPOINT,
            payload: {
              type: 'minute_checkpoint',
              data: {
                elapsedTime: timerState.elapsedTime,
                progress: timerState.progress
              }
            }
          });
        }
      };
      const onComplete = (completionData) => {
        dispatch({ type: ACTION_TYPES.COMPLETE_SESSION });
        dispatch({
          type: ACTION_TYPES.ADD_SESSION_EVENT,
          payload: {
            type: 'timer_completed',
            data: completionData
          }
        });
        if (configRef.current.onComplete) {
          configRef.current.onComplete(completionData);
        }
      };
      const onError = (error) => {
        dispatch({
          type: ACTION_TYPES.FAIL_SESSION,
          payload: { error: error.message }
        });
        if (configRef.current.onError) {
          configRef.current.onError(error);
        }
      };
      timerStrategyRef.current.start(timerConfig, onTick, onComplete, onError);
      dispatch({ type: ACTION_TYPES.START_TIMER });
      dispatch({ type: ACTION_TYPES.START_SESSION });
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: `Error al iniciar temporizador: ${error.message}`
      });
    }
  }, [state.currentActivity, state.timer.duration, dispatch]);
  const pauseTimer = useCallback(() => {
    if (!timerStrategyRef.current || !state.timer.isRunning) {
      return;
    }
    try {
      timerStrategyRef.current.pause();
      dispatch({ type: ACTION_TYPES.PAUSE_TIMER });
      dispatch({ type: ACTION_TYPES.PAUSE_SESSION });
      dispatch({
        type: ACTION_TYPES.ADD_SESSION_EVENT,
        payload: {
          type: 'timer_paused',
          data: { timeLeft: state.timer.timeLeft }
        }
      });
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: `Error al pausar temporizador: ${error.message}`
      });
    }
  }, [state.timer.isRunning, state.timer.timeLeft, dispatch]);
  const resumeTimer = useCallback(() => {
    if (!timerStrategyRef.current || state.timer.isRunning) {
      return;
    }
    try {
      timerStrategyRef.current.resume();
      dispatch({ type: ACTION_TYPES.START_TIMER });
      dispatch({ type: ACTION_TYPES.RESUME_SESSION });
      dispatch({
        type: ACTION_TYPES.ADD_SESSION_EVENT,
        payload: {
          type: 'timer_resumed',
          data: { timeLeft: state.timer.timeLeft }
        }
      });
    } catch (error) {
      console.error('Error reanudando temporizador:', error);
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: `Error al reanudar temporizador: ${error.message}`
      });
    }
  }, [state.timer.isRunning, state.timer.timeLeft, dispatch]);
  const resetTimer = useCallback(() => {
    try {
      if (timerStrategyRef.current) {
        timerStrategyRef.current.reset();
      }
      dispatch({ type: ACTION_TYPES.RESET_TIMER });
      dispatch({ type: ACTION_TYPES.CLEAR_SESSION_HISTORY });
      dispatch({
        type: ACTION_TYPES.ADD_SESSION_EVENT,
        payload: {
          type: 'timer_reset',
          data: { resetAt: new Date() }
        }
      });
    } catch (error) {
      console.error('Error reseteando temporizador:', error);
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: `Error al resetear temporizador: ${error.message}`
      });
    }
  }, [dispatch]);
  const stopSession = useCallback(() => {
    try {
      if (timerStrategyRef.current) {
        timerStrategyRef.current.destroy();
        timerStrategyRef.current = null;
      }
      dispatch({ type: ACTION_TYPES.CLEAR_CURRENT_ACTIVITY });
    } catch (error) {
      console.error('Error deteniendo sesión:', error);
    }
  }, [dispatch]);
  const getActivitySpecificConfig = useCallback((activity) => {
    const config = {};
    switch (activity.category?.toLowerCase()) {
      case 'meditation':
      case 'mindfulness':
        config.breathingPattern = {
          inhale: 4,
          hold: 4,
          exhale: 6,
          pause: 2
        };
        break;
      case 'exercise':
      case 'movement':
        config.interval = 500; // Actualización más frecuente
        break;
      case 'focus':
      case 'productivity':
        if (activity.estimatedDuration >= 1200) { // 20+ minutos
          config.workDuration = activity.estimatedDuration * 0.8;
          config.breakDuration = activity.estimatedDuration * 0.2;
          config.intervals = 1;
        }
        break;
      default:
        break;
    }
    return config;
  }, []);
  const getTimerInfo = useCallback(() => {
    const strategy = timerStrategyRef.current;
    const strategyState = strategy ? strategy.getState() : null;
    return {
      isInitialized: !!strategy,
      hasActivity: !!state.currentActivity,
      timeLeft: state.timer.timeLeft,
      progress: state.timer.progress,
      isRunning: state.timer.isRunning,
      sessionStatus: state.session.status,
      startedAt: state.session.startedAt,
      strategyState,
      activity: state.currentActivity,
      error: state.ui.error
    };
  }, [state, timerStrategyRef.current]);
  useEffect(() => {
    return () => {
      if (timerStrategyRef.current) {
        timerStrategyRef.current.destroy();
      }
    };
  }, []);
  return {
    initializeTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopSession,
    getTimerInfo,
    timeLeft: state.timer.timeLeft,
    progress: state.timer.progress,
    isRunning: state.timer.isRunning,
    activity: state.currentActivity,
    sessionStatus: state.session.status,
    error: state.ui.error,
    isInitialized: !!timerStrategyRef.current,
    canStart: !!state.currentActivity && !state.timer.isRunning,
    canPause: state.timer.isRunning && state.session.status === 'running',
    canResume: !state.timer.isRunning && state.session.status === 'paused',
    canReset: state.session.status !== 'idle',
    formattedTimeLeft: formatTime(state.timer.timeLeft),
    progressPercentage: Math.round(state.timer.progress * 100)
  };
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
export default useActivityTimer;
