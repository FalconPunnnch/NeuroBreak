class NotificationService {
  constructor() {
    this.notificationPermission = null;
    this.audioContext = null;
    this.soundEnabled = false;
    this.fallbackCallbacks = [];
  }
  async initialize() {
    await this._checkNotificationPermission();
    this._initializeAudioContext();
  }
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      throw new Error('Este navegador no soporta notificaciones');
    }
    try {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error solicitando permisos de notificación:', error);
      return false;
    }
  }
  async _checkNotificationPermission() {
    if ('Notification' in window) {
      this.notificationPermission = Notification.permission;
    }
  }
  async showTimerEndNotification(microactivityTitle = null) {
    if (!this._canShowNotifications()) {
      return false;
    }
    try {
      const title = '⏰ Tiempo de concentración completado';
      const message = microactivityTitle 
        ? `¡Hora de hacer: ${microactivityTitle}!`
        : '¡Hora de tomar un descanso activo!';
      const notification = new Notification(title, {
        body: message,
        icon: '/icons/timer-icon-96.png', // Asumiendo que tenemos un icono
        badge: '/icons/timer-badge-72.png',
        tag: 'concentration-timer',
        requireInteraction: true, // Requiere interacción del usuario
        silent: false
      });
      setTimeout(() => {
        notification.close();
      }, 10000);
      return true;
    } catch (error) {
      console.error('Error mostrando notificación:', error);
      return false;
    }
  }
  async playEndSound() {
    console.log('🔔 Iniciando reproducción de sonido de finalización');
    try {
      const audioPlayed = await this._playAudioFile();
      if (!audioPlayed) {
        console.log('📢 Usando audio sintético como fallback');
        await this._playSyntheticSound();
      } else {
        console.log('✅ Archivo de audio reproducido exitosamente');
      }
      console.log('✅ Sonido de finalización completado');
      return true;
    } catch (error) {
      console.error('Error reproduciendo sonido:', error);
      this._triggerFallbackNotification();
      return false;
    }
  }
  registerFallbackCallback(callback) {
    this.fallbackCallbacks.push(callback);
  }
  unregisterFallbackCallback(callback) {
    const index = this.fallbackCallbacks.indexOf(callback);
    if (index > -1) {
      this.fallbackCallbacks.splice(index, 1);
    }
  }
  async _playAudioFile() {
    try {
      const audioSources = [
        '/sounds/timer-end.mp3',
        '/sounds/end.mp3',
        '/public/sounds/timer-end.mp3'
      ];
      for (const source of audioSources) {
        try {
          const audio = new Audio(source);
          audio.volume = 0.6; // Volumen moderado
          await new Promise((resolve, reject) => {
            audio.onloadeddata = () => {
              audio.play()
                .then(() => resolve(true))
                .catch(reject);
            };
            audio.onerror = reject;
            setTimeout(() => reject(new Error('Timeout loading audio')), 2000);
          });
          return true; // Éxito
        } catch (audioError) {
          console.warn(`No se pudo cargar audio desde: ${source}`, audioError);
          continue; // Intentar siguiente fuente
        }
      }
      return false; // No se pudo reproducir ningún archivo
    } catch (error) {
      console.error('Error en _playAudioFile:', error);
      return false;
    }
  }
  async _playSyntheticSound() {
    try {
      if (!this.audioContext) {
        this._initializeAudioContext();
      }
      if (!this.audioContext) {
        throw new Error('AudioContext no disponible');
      }
      const frequencies = [800, 1000, 800, 1000, 800]; // Alternancia de frecuencias
      for (let i = 0; i < frequencies.length; i++) {
        const startTime = this.audioContext.currentTime + (i * 0.3);
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.frequency.setValueAtTime(frequencies[i], startTime);
        oscillator.type = 'square'; // Sonido más penetrante para alarma
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.25);
      }
      return true;
    } catch (error) {
      console.error('Error generando sonido sintético:', error);
      return false;
    }
  }
  _initializeAudioContext() {
    try {
      if ('AudioContext' in window) {
        this.audioContext = new AudioContext();
      } else if ('webkitAudioContext' in window) {
        this.audioContext = new webkitAudioContext();
      }
    } catch (error) {
      console.warn('No se pudo inicializar AudioContext:', error);
    }
  }
  _canShowNotifications() {
    return 'Notification' in window && 
           this.notificationPermission === 'granted';
  }
  _triggerFallbackNotification() {
    this.fallbackCallbacks.forEach(callback => {
      try {
        callback('El tiempo de concentración ha terminado');
      } catch (error) {
        console.error('Error en callback de fallback:', error);
      }
    });
  }
  cleanup() {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.fallbackCallbacks = [];
  }
  getBrowserSupport() {
    return {
      notifications: 'Notification' in window,
      audio: 'Audio' in window,
      audioContext: 'AudioContext' in window || 'webkitAudioContext' in window,
      currentNotificationPermission: this.notificationPermission
    };
  }
}
const notificationService = new NotificationService();
notificationService.initialize().catch(error => {
  console.warn('Error inicializando NotificationService:', error);
});
export default notificationService;
