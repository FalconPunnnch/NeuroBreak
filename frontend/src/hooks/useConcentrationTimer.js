import { useEffect, useRef, useCallback } from 'react';
import { useTimer } from 'contexts/TimerContext';
import { TimerStrategyFactory } from 'patterns/strategies/TimerStrategy';
export default function useConcentrationTimer(timerType = 'countdown') {
  const {
    duration,
    isRunning,
    isPaused,
    timeLeft,
    progress,
    nextMicroactivity,
    startTimer: startTimerContext,
    pauseTimer: pauseTimerContext,
    resumeTimer: resumeTimerContext,
    resetTimer: resetTimerContext,
    tick,
    completeTimer,
    triggerEndModal
  } = useTimer();
  const timerStrategyRef = useRef(null);
  const intervalRef = useRef(null);
  useEffect(() => {
    if (!timerStrategyRef.current) {
      try {
        timerStrategyRef.current = TimerStrategyFactory.create(timerType);
      } catch (error) {
        console.error('Error creando estrategia de timer:', error);
        timerStrategyRef.current = TimerStrategyFactory.create('countdown');
      }
    }
    return () => {
      if (timerStrategyRef.current) {
        timerStrategyRef.current.destroy();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerType]);
  const startTimer = useCallback(() => {
    if (!timerStrategyRef.current || isRunning || duration <= 0) {
      return;
    }
    try {
      const timerConfig = {
        duration: duration,
        interval: 1000 // 1 segundo
      };
      const onTick = (timerState) => {
        tick();
      };
      const onComplete = () => {
        completeTimer();
        triggerEndModal();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
      const onError = (error) => {
        console.error('Error en temporizador:', error);
        pauseTimerContext();
      };
      timerStrategyRef.current.start(timerConfig, onTick, onComplete, onError);
      startTimerContext();
    } catch (error) {
      console.error('Error iniciando timer:', error);
    }
  }, [duration, isRunning, startTimerContext, tick, completeTimer, triggerEndModal, pauseTimerContext]);
  const pauseTimer = useCallback(() => {
    if (!timerStrategyRef.current || !isRunning || isPaused) {
      return;
    }
    try {
      timerStrategyRef.current.pause();
      pauseTimerContext();
    } catch (error) {
      console.error('Error pausando timer:', error);
    }
  }, [isRunning, isPaused, pauseTimerContext]);
  const resumeTimer = useCallback(() => {
    if (!timerStrategyRef.current || !isRunning || !isPaused) {
      return;
    }
    try {
      timerStrategyRef.current.resume();
      resumeTimerContext();
    } catch (error) {
      console.error('Error reanudando timer:', error);
    }
  }, [isRunning, isPaused, resumeTimerContext]);
  const stopTimer = useCallback(() => {
    if (!timerStrategyRef.current) {
      return;
    }
    try {
      timerStrategyRef.current.reset();
      resetTimerContext();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (error) {
      console.error('Error deteniendo timer:', error);
    }
  }, [resetTimerContext]);
  const resetTimer = useCallback(() => {
    if (!timerStrategyRef.current) {
      return;
    }
    try {
      timerStrategyRef.current.reset();
      resetTimerContext();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (error) {
      console.error('Error reseteando timer:', error);
    }
  }, [resetTimerContext]);
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);
  const progressPercentage = duration > 0 ? Math.round(progress * 100) : 0;
  return {
    timeLeft,
    isRunning,
    isPaused,
    duration,
    progress,
    progressPercentage,
    nextMicroactivity,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    formattedTime: formatTime(timeLeft),
    formattedDuration: formatTime(duration),
    canStart: !isRunning && duration > 0,
    canPause: isRunning && !isPaused,
    canResume: isRunning && isPaused,
    canStop: isRunning,
    canReset: timeLeft !== duration || isRunning,
    isInitialized: !!timerStrategyRef.current
  };
}
