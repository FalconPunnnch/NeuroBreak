import { playEndSound } from '../../utils/audio';
import notificationService from '../../services/notificationService';

export class TimerStrategy {
  start(config, onTick, onComplete, onError) {
    throw new Error('Method start() must be implemented by concrete strategy');
  }
  pause() {
    throw new Error('Method pause() must be implemented by concrete strategy');
  }
  resume() {
    throw new Error('Method resume() must be implemented by concrete strategy');
  }
  reset() {
    throw new Error('Method reset() must be implemented by concrete strategy');
  }
  getState() {
    throw new Error('Method getState() must be implemented by concrete strategy');
  }
  destroy() {
    throw new Error('Method destroy() must be implemented by concrete strategy');
  }
}
export class CountdownTimerStrategy extends TimerStrategy {
  constructor() {
    super();
    this.intervalId = null;
    this.isRunning = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedTime = null;
    this.totalPausedDuration = 0;
    this.config = null;
    this.callbacks = {};
  }
  start(config, onTick, onComplete, onError) {
    this.config = {
      duration: config.duration || 300, // 5 minutos por defecto
      interval: config.interval || 1000, // 1 segundo por defecto
      ...config
    };
    console.log('⚙️ CountdownTimerStrategy configuración final:', this.config);
    this.callbacks = { onTick, onComplete, onError };
    this.startTime = Date.now();
    this.totalPausedDuration = 0;
    this.isRunning = true;
    this.isPaused = false;
    this._startInterval();
  }
  pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    this.pausedTime = Date.now();
    this._clearInterval();
  }
  resume() {
    if (!this.isRunning || !this.isPaused) return;
    const pauseDuration = Date.now() - this.pausedTime;
    this.totalPausedDuration += pauseDuration;
    this.isPaused = false;
    this.pausedTime = null;
    this._startInterval();
  }
  reset() {
    this._clearInterval();
    this.isRunning = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedTime = null;
    this.totalPausedDuration = 0;
  }
  getState() {
    if (!this.isRunning) {
      return {
        timeLeft: this.config?.duration || 0,
        progress: 0,
        isRunning: false,
        isPaused: false,
        elapsedTime: 0
      };
    }
    const now = this.isPaused ? this.pausedTime : Date.now();
    const elapsedTime = (now - this.startTime - this.totalPausedDuration) / 1000;
    const timeLeft = Math.max(0, this.config.duration - elapsedTime);
    const progress = Math.min(1, elapsedTime / this.config.duration);
    return {
      timeLeft: Math.ceil(timeLeft),
      progress,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      elapsedTime: Math.floor(elapsedTime)
    };
  }
  destroy() {
    this.reset();
    this.callbacks = {};
    this.config = null;
  }
  _startInterval() {
    this._clearInterval();
    try {
      this.intervalId = setInterval(() => {
        try {
          const state = this.getState();
          if (this.callbacks.onTick) {
            this.callbacks.onTick(state);
          }
          if (state.timeLeft <= 0) {
            this._clearInterval();
            this.isRunning = false;
            
            // Reproducir sonido de finalización
            playEndSound({ volume: 0.6 }).catch(error => {
              console.warn('Error reproduciendo sonido de finalización:', error);
            });
            
            // Mostrar notificación
            notificationService.playEndSound().catch(error => {
              console.warn('Error con notificación de audio:', error);
            });
            
            console.log('⏰ Timer completado - ejecutando callback de finalización');
            if (this.callbacks.onComplete) {
              this.callbacks.onComplete({
                ...state,
                totalDuration: this.config.duration,
                actualDuration: state.elapsedTime
              });
            }
          }
        } catch (error) {
          console.error('Error en tick del temporizador:', error);
          this._clearInterval();
          this.isRunning = false;
          if (this.callbacks.onError) {
            this.callbacks.onError(error);
          }
        }
      }, this.config.interval);
    } catch (error) {
      console.error('Error iniciando interval del temporizador:', error);
      if (this.callbacks.onError) {
        this.callbacks.onError(error);
      }
    }
  }
  _clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
export class IntervalTimerStrategy extends TimerStrategy {
  constructor() {
    super();
    this.currentInterval = 0;
    this.currentPhase = 'work'; // 'work' | 'break'
    this.intervalId = null;
    this.isRunning = false;
    this.isPaused = false;
    this.config = null;
    this.callbacks = {};
    this.phaseStartTime = null;
    this.totalPausedDuration = 0;
  }
  start(config, onTick, onComplete, onError) {
    this.config = {
      workDuration: config.workDuration || 1500, // 25 minutos
      breakDuration: config.breakDuration || 300, // 5 minutos
      intervals: config.intervals || 4,
      interval: config.interval || 1000,
      ...config
    };
    this.callbacks = { onTick, onComplete, onError };
    this.currentInterval = 0;
    this.currentPhase = 'work';
    this.isRunning = true;
    this.isPaused = false;
    this.totalPausedDuration = 0;
    this._startPhase();
  }
  pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    this.pausedTime = Date.now();
    this._clearInterval();
  }
  resume() {
    if (!this.isRunning || !this.isPaused) return;
    const pauseDuration = Date.now() - this.pausedTime;
    this.totalPausedDuration += pauseDuration;
    this.isPaused = false;
    this.pausedTime = null;
    this._startInterval();
  }
  reset() {
    this._clearInterval();
    this.currentInterval = 0;
    this.currentPhase = 'work';
    this.isRunning = false;
    this.isPaused = false;
    this.phaseStartTime = null;
    this.totalPausedDuration = 0;
  }
  getState() {
    if (!this.isRunning || !this.phaseStartTime) {
      return {
        timeLeft: this.config?.workDuration || 0,
        progress: 0,
        isRunning: false,
        isPaused: false,
        currentInterval: this.currentInterval,
        currentPhase: this.currentPhase,
        totalIntervals: this.config?.intervals || 1
      };
    }
    const now = this.isPaused ? this.pausedTime : Date.now();
    const elapsedTime = (now - this.phaseStartTime - this.totalPausedDuration) / 1000;
    const phaseDuration = this.currentPhase === 'work' 
      ? this.config.workDuration 
      : this.config.breakDuration;
    const timeLeft = Math.max(0, phaseDuration - elapsedTime);
    const progress = Math.min(1, elapsedTime / phaseDuration);
    return {
      timeLeft: Math.ceil(timeLeft),
      progress,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      currentInterval: this.currentInterval,
      currentPhase: this.currentPhase,
      totalIntervals: this.config.intervals,
      elapsedTime: Math.floor(elapsedTime)
    };
  }
  destroy() {
    this.reset();
    this.callbacks = {};
    this.config = null;
  }
  _startPhase() {
    this.phaseStartTime = Date.now();
    this.totalPausedDuration = 0;
    this._startInterval();
  }
  _startInterval() {
    this._clearInterval();
    this.intervalId = setInterval(() => {
      const state = this.getState();
      if (this.callbacks.onTick) {
        this.callbacks.onTick(state);
      }
      if (state.timeLeft <= 0) {
        this._completePhase();
      }
    }, this.config.interval);
  }
  _completePhase() {
    this._clearInterval();
    if (this.currentPhase === 'work') {
      this.currentInterval++;
      if (this.currentInterval >= this.config.intervals) {
        this.isRunning = false;
        if (this.callbacks.onComplete) {
          this.callbacks.onComplete({
            totalIntervals: this.config.intervals,
            completedIntervals: this.currentInterval,
            totalWorkTime: this.config.intervals * this.config.workDuration,
            totalBreakTime: (this.config.intervals - 1) * this.config.breakDuration
          });
        }
        return;
      }
      this.currentPhase = 'break';
    } else {
      this.currentPhase = 'work';
    }
    this._startPhase();
  }
  _clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
export class MeditationTimerStrategy extends TimerStrategy {
  constructor() {
    super();
    this.intervalId = null;
    this.breathingId = null;
    this.isRunning = false;
    this.isPaused = false;
    this.breathingPhase = 'inhale'; // 'inhale' | 'hold' | 'exhale' | 'pause'
    this.breathingCycle = 0;
    this.config = null;
    this.callbacks = {};
    this.startTime = null;
    this.totalPausedDuration = 0;
  }
  start(config, onTick, onComplete, onError) {
    this.config = {
      duration: config.duration || 600, // 10 minutos por defecto
      breathingPattern: config.breathingPattern || {
        inhale: 4,   // segundos
        hold: 4,     // segundos
        exhale: 6,   // segundos
        pause: 2     // segundos
      },
      interval: config.interval || 1000,
      breathingInterval: config.breathingInterval || 250, // 4 veces por segundo para suavidad
      ...config
    };
    this.callbacks = { onTick, onComplete, onError };
    this.startTime = Date.now();
    this.totalPausedDuration = 0;
    this.breathingCycle = 0;
    this.breathingPhase = 'inhale';
    this.isRunning = true;
    this.isPaused = false;
    this._startTimers();
  }
  pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    this.pausedTime = Date.now();
    this._clearTimers();
  }
  resume() {
    if (!this.isRunning || !this.isPaused) return;
    const pauseDuration = Date.now() - this.pausedTime;
    this.totalPausedDuration += pauseDuration;
    this.isPaused = false;
    this.pausedTime = null;
    this._startTimers();
  }
  reset() {
    this._clearTimers();
    this.isRunning = false;
    this.isPaused = false;
    this.breathingPhase = 'inhale';
    this.breathingCycle = 0;
    this.startTime = null;
    this.totalPausedDuration = 0;
  }
  getState() {
    if (!this.isRunning || !this.startTime) {
      return {
        timeLeft: this.config?.duration || 0,
        progress: 0,
        isRunning: false,
        isPaused: false,
        breathingPhase: 'inhale',
        breathingCycle: 0,
        elapsedTime: 0
      };
    }
    const now = this.isPaused ? this.pausedTime : Date.now();
    const elapsedTime = (now - this.startTime - this.totalPausedDuration) / 1000;
    const timeLeft = Math.max(0, this.config.duration - elapsedTime);
    const progress = Math.min(1, elapsedTime / this.config.duration);
    return {
      timeLeft: Math.ceil(timeLeft),
      progress,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      breathingPhase: this.breathingPhase,
      breathingCycle: this.breathingCycle,
      elapsedTime: Math.floor(elapsedTime)
    };
  }
  destroy() {
    this.reset();
    this.callbacks = {};
    this.config = null;
  }
  _startTimers() {
    this._startMainTimer();
    this._startBreathingTimer();
  }
  _clearTimers() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.breathingId) {
      clearInterval(this.breathingId);
      this.breathingId = null;
    }
  }
  _startMainTimer() {
    this.intervalId = setInterval(() => {
      const state = this.getState();
      if (this.callbacks.onTick) {
        this.callbacks.onTick(state);
      }
      if (state.timeLeft <= 0) {
        this._clearTimers();
        this.isRunning = false;
        if (this.callbacks.onComplete) {
          this.callbacks.onComplete({
            ...state,
            totalDuration: this.config.duration,
            breathingCycles: this.breathingCycle
          });
        }
      }
    }, this.config.interval);
  }
  _startBreathingTimer() {
    const pattern = this.config.breathingPattern;
    let phaseTime = 0;
    this.breathingId = setInterval(() => {
      phaseTime += this.config.breathingInterval / 1000;
      const currentPhaseDuration = pattern[this.breathingPhase];
      if (phaseTime >= currentPhaseDuration) {
        phaseTime = 0;
        this._nextBreathingPhase();
      }
    }, this.config.breathingInterval);
  }
  _nextBreathingPhase() {
    switch (this.breathingPhase) {
      case 'inhale':
        this.breathingPhase = 'hold';
        break;
      case 'hold':
        this.breathingPhase = 'exhale';
        break;
      case 'exhale':
        this.breathingPhase = 'pause';
        break;
      case 'pause':
        this.breathingPhase = 'inhale';
        this.breathingCycle++;
        break;
    }
  }
}
export class TimerStrategyFactory {
  static create(type = 'countdown') {
    switch (type.toLowerCase()) {
      case 'countdown':
        return new CountdownTimerStrategy();
      case 'interval':
      case 'pomodoro':
        return new IntervalTimerStrategy();
      case 'meditation':
      case 'breathing':
        return new MeditationTimerStrategy();
      default:
        throw new Error(`Timer strategy '${type}' is not supported`);
    }
  }
  static getSupportedTypes() {
    return ['countdown', 'interval', 'pomodoro', 'meditation', 'breathing'];
  }
}
