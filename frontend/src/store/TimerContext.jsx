import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { playEndSound } from '../utils/audio';
import notificationService from '../services/notificationService';

const initialState = {
  duration: 25 * 60, // 25 minutos por defecto en segundos
  avoidN: 3, // Evitar últimas N microactividades
  isRunning: false,
  isPaused: false,
  timeLeft: 25 * 60,
  progress: 0,
  nextMicroactivityId: null,
  nextMicroactivity: null,
  recentIds: [],
  audioEnabled: true,
  notificationsEnabled: true,
  headsetsRecommended: false,
  showConfirmationModal: false,
  showEndModal: false
};
const TimerActionTypes = {
  SET_DURATION: 'SET_DURATION',
  SET_AVOID_N: 'SET_AVOID_N',
  SET_NEXT_MICROACTIVITY: 'SET_NEXT_MICROACTIVITY',
  START_TIMER: 'START_TIMER',
  PAUSE_TIMER: 'PAUSE_TIMER',
  RESUME_TIMER: 'RESUME_TIMER',
  STOP_TIMER: 'STOP_TIMER',
  RESET_TIMER: 'RESET_TIMER',
  TICK: 'TICK',
  TIMER_COMPLETE: 'TIMER_COMPLETE',
  ADD_TO_RECENT: 'ADD_TO_RECENT',
  ENABLE_AUDIO: 'ENABLE_AUDIO',
  ENABLE_NOTIFICATIONS: 'ENABLE_NOTIFICATIONS',
  SHOW_CONFIRMATION_MODAL: 'SHOW_CONFIRMATION_MODAL',
  HIDE_CONFIRMATION_MODAL: 'HIDE_CONFIRMATION_MODAL',
  SHOW_END_MODAL: 'SHOW_END_MODAL',
  HIDE_END_MODAL: 'HIDE_END_MODAL',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE'
};
function timerReducer(state, action) {
  switch (action.type) {
    case TimerActionTypes.SET_DURATION:
      return {
        ...state,
        duration: action.payload,
        timeLeft: state.isRunning ? state.timeLeft : action.payload
      };
    case TimerActionTypes.SET_AVOID_N:
      return {
        ...state,
        avoidN: Math.max(1, action.payload)
      };
    case TimerActionTypes.SET_NEXT_MICROACTIVITY:
      return {
        ...state,
        nextMicroactivityId: action.payload?.id || null,
        nextMicroactivity: action.payload || null
      };
    case TimerActionTypes.START_TIMER:
      return {
        ...state,
        isRunning: true,
        isPaused: false,
        timeLeft: state.duration
      };
    case TimerActionTypes.PAUSE_TIMER:
      return {
        ...state,
        isRunning: false,
        isPaused: true
      };
    case TimerActionTypes.RESUME_TIMER:
      return {
        ...state,
        isRunning: true,
        isPaused: false
      };
    case TimerActionTypes.STOP_TIMER:
    case TimerActionTypes.RESET_TIMER:
      return {
        ...state,
        isRunning: false,
        isPaused: false,
        timeLeft: state.duration,
        progress: 0
      };
    case TimerActionTypes.TICK:
      if (!state.isRunning || state.isPaused || state.timeLeft <= 0) {
        return state; // No hacer cambios si no debe hacer tick
      }
      const newTimeLeft = Math.max(0, state.timeLeft - 1);
      const newProgress = 1 - (newTimeLeft / state.duration);
      return {
        ...state,
        timeLeft: newTimeLeft,
        progress: newProgress
      };
    case TimerActionTypes.TIMER_COMPLETE:
      // Reproducir sonido de finalización cuando se completa
      playEndSound({ volume: 0.7 }).then(success => {
        console.log(success ? '✅ Sonido de timer ejecutado' : '⚠️ Fallback de sonido ejecutado');
      }).catch(error => {
        console.warn('Error reproduciendo sonido:', error);
      });
      
      return {
        ...state,
        isRunning: false,
        isPaused: false,
        timeLeft: 0,
        progress: 1,
        showEndModal: true
      };
    case TimerActionTypes.ADD_TO_RECENT:
      const updatedRecent = [action.payload, ...state.recentIds]
        .slice(0, state.avoidN);
      return {
        ...state,
        recentIds: updatedRecent
      };
    case TimerActionTypes.ENABLE_AUDIO:
      return {
        ...state,
        audioEnabled: action.payload
      };
    case TimerActionTypes.ENABLE_NOTIFICATIONS:
      return {
        ...state,
        notificationsEnabled: action.payload
      };
    case TimerActionTypes.SHOW_CONFIRMATION_MODAL:
      return {
        ...state,
        showConfirmationModal: true
      };
    case TimerActionTypes.HIDE_CONFIRMATION_MODAL:
      return {
        ...state,
        showConfirmationModal: false
      };
    case TimerActionTypes.SHOW_END_MODAL:
      return {
        ...state,
        showEndModal: true
      };
    case TimerActionTypes.HIDE_END_MODAL:
      return {
        ...state,
        showEndModal: false
      };
    case TimerActionTypes.LOAD_FROM_STORAGE:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
const TimerContext = createContext();
export function TimerProvider({ children }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  
  // Inicializar servicios de audio
  useEffect(() => {
    notificationService.initialize().catch(error => {
      console.warn('Error inicializando servicios de notificación:', error);
    });
  }, []);
  useEffect(() => {
    const savedConfig = localStorage.getItem('concentrationTimer');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        dispatch({
          type: TimerActionTypes.LOAD_FROM_STORAGE,
          payload: {
            duration: parsed.duration || initialState.duration,
            avoidN: parsed.avoidN || initialState.avoidN,
            recentIds: parsed.recentIds || [],
            audioEnabled: parsed.audioEnabled !== undefined ? parsed.audioEnabled : true,
            notificationsEnabled: parsed.notificationsEnabled !== undefined ? parsed.notificationsEnabled : true,
            showEndModal: false,
            isRunning: false,
            isPaused: false
          }
        });
      } catch (error) {
      }
    }
    dispatch({ type: TimerActionTypes.HIDE_END_MODAL });
  }, []);
  useEffect(() => {
    const configToPersist = {
      duration: state.duration,
      avoidN: state.avoidN,
      recentIds: state.recentIds,
      audioEnabled: state.audioEnabled,
      notificationsEnabled: state.notificationsEnabled
    };
    localStorage.setItem('concentrationTimer', JSON.stringify(configToPersist));
  }, [
    state.duration, 
    state.avoidN, 
    state.recentIds, 
    state.audioEnabled, 
    state.notificationsEnabled
  ]);
  const actions = {
    setDuration: (duration) => {
      dispatch({ type: TimerActionTypes.SET_DURATION, payload: duration });
    },
    setAvoidN: (n) => {
      dispatch({ type: TimerActionTypes.SET_AVOID_N, payload: n });
    },
    setNextMicroactivity: (microactivity) => {
      dispatch({ 
        type: TimerActionTypes.SET_NEXT_MICROACTIVITY, 
        payload: microactivity 
      });
    },
    startTimer: () => {
      dispatch({ type: TimerActionTypes.START_TIMER });
    },
    pauseTimer: () => {
      dispatch({ type: TimerActionTypes.PAUSE_TIMER });
    },
    resumeTimer: () => {
      dispatch({ type: TimerActionTypes.RESUME_TIMER });
    },
    stopTimer: () => {
      dispatch({ type: TimerActionTypes.STOP_TIMER });
    },
    resetTimer: () => {
      dispatch({ type: TimerActionTypes.RESET_TIMER });
    },
    tick: () => {
      dispatch({ type: TimerActionTypes.TICK });
    },
    completeTimer: () => {
      dispatch({ type: TimerActionTypes.TIMER_COMPLETE });
    },
    addToRecent: (id) => {
      dispatch({ type: TimerActionTypes.ADD_TO_RECENT, payload: id });
    },
    enableAudio: (enabled) => {
      dispatch({ type: TimerActionTypes.ENABLE_AUDIO, payload: enabled });
    },
    enableNotifications: (enabled) => {
      dispatch({ type: TimerActionTypes.ENABLE_NOTIFICATIONS, payload: enabled });
    },
    showConfirmationModal: () => {
      dispatch({ type: TimerActionTypes.SHOW_CONFIRMATION_MODAL });
    },
    hideConfirmationModal: () => {
      dispatch({ type: TimerActionTypes.HIDE_CONFIRMATION_MODAL });
    },
    triggerEndModal: () => {
      dispatch({ type: TimerActionTypes.SHOW_END_MODAL });
    },
    hideEndModal: () => {
      dispatch({ type: TimerActionTypes.HIDE_END_MODAL });
    }
  };
  const value = {
    ...state,
    ...actions
  };
  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}
export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer debe ser usado dentro de TimerProvider');
  }
  return context;
}
export { TimerActionTypes };
