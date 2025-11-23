const EMBEDDED_TIMER_SOUND = (() => {
  return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVEw1Mn+DwuW8gCCuR3vTNeSsFJH3H8N2QQAoUXrTp66hVEw1Mn+DwuW8gCCuR3vTNeSsFJH3H8N2QQAoUXrTp66hVEw1Mn+DwuW8gCCuR3vTNeSsFJH3H8N2QQAoUXrTp66hVEw1Mn+DwuW8gCCuR3vTNeSsFJH3H8N2QQAoUXrTp66hVEw1Mn+DwuW8gCCuR3vTNeSsFJH3H8N2QQAoUXrTp66hVEw==';
})();
class TimerAudio {
  constructor() {
    this.audioContext = null;
    this.fallbackCallbacks = new Set();
    this.isInitialized = false;
  }
  async initialize() {
    if (this.isInitialized) return true;
    try {
      if (window.AudioContext || window.webkitAudioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContextClass();
      }
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.warn('Error inicializando contexto de audio:', error);
      return false;
    }
  }
  async playEndSound(options = {}) {
    const {
      volume = 0.6,
      duration = 1.5,
      frequency = 523.25, // C5
      type = 'auto' // 'auto', 'file', 'synthetic', 'embedded'
    } = options;
    try {
      if (type === 'auto' || type === 'embedded') {
        const success = await this._playEmbeddedSound(volume);
        if (success) return true;
      }
      if (type === 'auto' || type === 'file') {
        const success = await this._playAudioFile(volume);
        if (success) return true;
      }
      if (type === 'auto' || type === 'synthetic') {
        const success = await this._playSyntheticSound({
          volume,
          duration,
          frequency
        });
        if (success) return true;
      }
      this._triggerFallback('timer-end');
      return false;
    } catch (error) {
      this._triggerFallback('timer-end');
      return false;
    }
  }
  async _playEmbeddedSound(volume = 0.6) {
    try {
      const audio = new Audio(EMBEDDED_TIMER_SOUND);
      audio.volume = Math.min(Math.max(volume, 0), 1);
      await audio.play();
      return true;
    } catch (error) {
      console.warn('No se pudo reproducir sonido embebido:', error);
      return false;
    }
  }
  async _playAudioFile(volume = 0.6) {
    const audioSources = [
      '/sounds/timer-end-soft.mp3',
      '/sounds/timer-end.mp3',
      '/sounds/bell-soft.mp3',
      '/sounds/notification.mp3'
    ];
    for (const source of audioSources) {
      try {
        const audio = new Audio(source);
        audio.volume = Math.min(Math.max(volume, 0), 1);
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Timeout loading audio'));
          }, 2000);
          audio.addEventListener('loadeddata', () => {
            clearTimeout(timeout);
            audio.play()
              .then(() => resolve(true))
              .catch(reject);
          });
          audio.addEventListener('error', () => {
            clearTimeout(timeout);
            reject(new Error(`Error loading ${source}`));
          });
        });
        return true; // Éxito
      } catch (error) {
        console.warn(`No se pudo cargar: ${source}`, error);
        continue; // Intentar siguiente fuente
      }
    }
    return false; // No se pudo cargar ningún archivo
  }
  async _playSyntheticSound(options = {}) {
    const {
      volume = 0.6,
      duration = 1.5,
      frequency = 523.25
    } = options;
    try {
      if (!this.audioContext) {
        await this.initialize();
      }
      if (!this.audioContext) {
        throw new Error('AudioContext no disponible');
      }
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = 'sine'; // Forma de onda suave
      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.1); // Ataque suave
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration); // Liberación suave
      oscillator.start(now);
      oscillator.stop(now + duration);
      return true;
    } catch (error) {
      console.warn('Error generando sonido sintético:', error);
      return false;
    }
  }
  registerFallbackCallback(callback) {
    this.fallbackCallbacks.add(callback);
  }
  unregisterFallbackCallback(callback) {
    this.fallbackCallbacks.delete(callback);
  }
  _triggerFallback(eventType = 'timer-end') {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]); // Patrón suave
      } catch (error) {
        console.warn('No se pudo activar vibración:', error);
      }
    }
    this.fallbackCallbacks.forEach(callback => {
      try {
        callback(eventType);
      } catch (error) {
        console.error('Error en callback de fallback:', error);
      }
    });
    try {
      const event = new CustomEvent('timer-audio-fallback', {
        detail: { type: eventType, timestamp: Date.now() }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.warn('No se pudo disparar evento de fallback:', error);
    }
  }
  getAudioCapabilities() {
    return {
      audioElement: 'Audio' in window,
      audioContext: !!(window.AudioContext || window.webkitAudioContext),
      vibrate: 'vibrate' in navigator,
      currentState: this.audioContext?.state || 'unavailable'
    };
  }
  cleanup() {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
        .catch(error => console.warn('Error cerrando AudioContext:', error));
    }
    this.fallbackCallbacks.clear();
    this.isInitialized = false;
  }
}
const timerAudio = new TimerAudio();
let autoInitPromise = null;
const ensureInitialized = async () => {
  if (!autoInitPromise) {
    autoInitPromise = timerAudio.initialize();
  }
  return autoInitPromise;
};
export const playEndSound = async (options = {}) => {
  await ensureInitialized();
  return timerAudio.playEndSound(options);
};
export const registerAudioFallback = (callback) => {
  timerAudio.registerFallbackCallback(callback);
};
export const unregisterAudioFallback = (callback) => {
  timerAudio.unregisterFallbackCallback(callback);
};
export const getAudioCapabilities = () => {
  return timerAudio.getAudioCapabilities();
};
export const cleanupAudio = () => {
  timerAudio.cleanup();
};
export default timerAudio;
