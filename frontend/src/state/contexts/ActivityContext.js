import React, { createContext, useContext, useReducer, useEffect } from 'react';
export const ACTIVITY_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed'
};
const initialState = {
  currentActivity: null,
  timer: {
    duration: 0,
    timeLeft: 0,
    isRunning: false,
    progress: 0
  },
  session: {
    status: ACTIVITY_STATUS.IDLE,
    startedAt: null,
    pausedAt: null,
    completedAt: null,
    pausedDuration: 0
  },
  ui: {
    isLoading: false,
    error: null
  },
  sessionHistory: {
    events: [],
    checkpoints: []
  }
};
export const ACTION_TYPES = {
  SET_CURRENT_ACTIVITY: 'SET_CURRENT_ACTIVITY',
  CLEAR_CURRENT_ACTIVITY: 'CLEAR_CURRENT_ACTIVITY',
  SET_TIMER_DURATION: 'SET_TIMER_DURATION',
  UPDATE_TIMER: 'UPDATE_TIMER',
  START_TIMER: 'START_TIMER',
  PAUSE_TIMER: 'PAUSE_TIMER',
  RESET_TIMER: 'RESET_TIMER',
  START_SESSION: 'START_SESSION',
  PAUSE_SESSION: 'PAUSE_SESSION',
  RESUME_SESSION: 'RESUME_SESSION',
  COMPLETE_SESSION: 'COMPLETE_SESSION',
  FAIL_SESSION: 'FAIL_SESSION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_SESSION_EVENT: 'ADD_SESSION_EVENT',
  ADD_CHECKPOINT: 'ADD_CHECKPOINT',
  CLEAR_SESSION_HISTORY: 'CLEAR_SESSION_HISTORY'
};
function activityReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_CURRENT_ACTIVITY:
      return {
        ...state,
        currentActivity: action.payload,
        timer: {
          ...state.timer,
          duration: action.payload?.estimatedDuration || 0,
          timeLeft: action.payload?.estimatedDuration || 0,
          progress: 0
        }
      };
    case ACTION_TYPES.CLEAR_CURRENT_ACTIVITY:
      return {
        ...initialState
      };
    case ACTION_TYPES.SET_TIMER_DURATION:
      return {
        ...state,
        timer: {
          ...state.timer,
          duration: action.payload,
          timeLeft: action.payload,
          progress: 0
        }
      };
    case ACTION_TYPES.UPDATE_TIMER:
      const { timeLeft, progress } = action.payload;
      return {
        ...state,
        timer: {
          ...state.timer,
          timeLeft,
          progress
        }
      };
    case ACTION_TYPES.START_TIMER:
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: true
        }
      };
    case ACTION_TYPES.PAUSE_TIMER:
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false
        }
      };
    case ACTION_TYPES.RESET_TIMER:
      return {
        ...state,
        timer: {
          ...state.timer,
          timeLeft: state.timer.duration,
          progress: 0,
          isRunning: false
        }
      };
    case ACTION_TYPES.START_SESSION:
      return {
        ...state,
        session: {
          ...state.session,
          status: ACTIVITY_STATUS.RUNNING,
          startedAt: new Date(),
          pausedAt: null,
          completedAt: null,
          pausedDuration: 0
        },
        sessionHistory: {
          events: [{
            type: 'session_started',
            timestamp: new Date(),
            data: { activityId: state.currentActivity?.id }
          }],
          checkpoints: []
        }
      };
    case ACTION_TYPES.PAUSE_SESSION:
      return {
        ...state,
        session: {
          ...state.session,
          status: ACTIVITY_STATUS.PAUSED,
          pausedAt: new Date()
        },
        sessionHistory: {
          ...state.sessionHistory,
          events: [
            ...state.sessionHistory.events,
            {
              type: 'session_paused',
              timestamp: new Date(),
              data: { timeLeft: state.timer.timeLeft }
            }
          ]
        }
      };
    case ACTION_TYPES.RESUME_SESSION:
      const pauseDuration = state.session.pausedAt 
        ? Date.now() - new Date(state.session.pausedAt).getTime()
        : 0;
      return {
        ...state,
        session: {
          ...state.session,
          status: ACTIVITY_STATUS.RUNNING,
          pausedAt: null,
          pausedDuration: state.session.pausedDuration + pauseDuration
        },
        sessionHistory: {
          ...state.sessionHistory,
          events: [
            ...state.sessionHistory.events,
            {
              type: 'session_resumed',
              timestamp: new Date(),
              data: { pauseDuration }
            }
          ]
        }
      };
    case ACTION_TYPES.COMPLETE_SESSION:
      return {
        ...state,
        session: {
          ...state.session,
          status: ACTIVITY_STATUS.COMPLETED,
          completedAt: new Date()
        },
        sessionHistory: {
          ...state.sessionHistory,
          events: [
            ...state.sessionHistory.events,
            {
              type: 'session_completed',
              timestamp: new Date(),
              data: { 
                totalDuration: state.timer.duration,
                actualDuration: action.payload?.actualDuration
              }
            }
          ]
        }
      };
    case ACTION_TYPES.FAIL_SESSION:
      return {
        ...state,
        session: {
          ...state.session,
          status: ACTIVITY_STATUS.FAILED
        },
        ui: {
          ...state.ui,
          error: action.payload?.error || 'La sesión falló'
        }
      };
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: action.payload
        }
      };
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload
        }
      };
    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: null
        }
      };
    case ACTION_TYPES.ADD_SESSION_EVENT:
      return {
        ...state,
        sessionHistory: {
          ...state.sessionHistory,
          events: [
            ...state.sessionHistory.events,
            {
              ...action.payload,
              timestamp: new Date()
            }
          ]
        }
      };
    case ACTION_TYPES.ADD_CHECKPOINT:
      return {
        ...state,
        sessionHistory: {
          ...state.sessionHistory,
          checkpoints: [
            ...state.sessionHistory.checkpoints,
            {
              ...action.payload,
              timestamp: new Date()
            }
          ]
        }
      };
    case ACTION_TYPES.CLEAR_SESSION_HISTORY:
      return {
        ...state,
        sessionHistory: {
          events: [],
          checkpoints: []
        }
      };
    default:
      return state;
  }
}
const ActivityContext = createContext(null);
export function ActivityProvider({ children }) {
  const [state, dispatch] = useReducer(activityReducer, initialState);
  useEffect(() => {
    return () => {
      if (state.timer.isRunning) {
        dispatch({ type: ACTION_TYPES.PAUSE_TIMER });
      }
    };
  }, []);
  return (
    <ActivityContext.Provider value={{ state, dispatch }}>
      {children}
    </ActivityContext.Provider>
  );
}
export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity debe usarse dentro de ActivityProvider');
  }
  return context;
}
export default ActivityContext;
