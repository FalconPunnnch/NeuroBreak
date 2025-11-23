import apiClient from '../infrastructure/api/apiClient';
class MicroactivityTimerService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }
  async getAllForTimer() {
    try {
      const cacheKey = 'all_microactivities';
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      const response = await apiClient.get('/microactivities');
      if (!response.data?.success) {
        console.warn('API response not successful:', response.data);
        return []; // Retornar array vacío en lugar de error
      }
      if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.warn('No microactivities data found');
        return []; // Retornar array vacío en lugar de error
      }
      const microactivities = response.data.data.map(raw => this._adaptForTimer(raw));
      this.cache.set(cacheKey, {
        data: microactivities,
        timestamp: Date.now()
      });
      return microactivities;
    } catch (error) {
      console.warn('Error en MicroactivityTimerService.getAllForTimer:', error);
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        console.info('Backend no disponible, usando datos de ejemplo para desarrollo');
        return this._getMockMicroactivities();
      }
      return [];
    }
  }
  async getByIdForTimer(id) {
    try {
      const cacheKey = `microactivity_${id}`;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      const response = await apiClient.get(`/microactivities/${id}`);
      if (!response.data?.success || !response.data?.data) {
        throw new Error(`Microactividad con ID ${id} no encontrada`);
      }
      const microactivity = this._adaptForTimer(response.data.data);
      this.cache.set(cacheKey, {
        data: microactivity,
        timestamp: Date.now()
      });
      return microactivity;
    } catch (error) {
      console.error('Error en MicroactivityTimerService.getByIdForTimer:', error);
      throw new Error(`Error cargando microactividad ${id}: ${error.message}`);
    }
  }
  async getByMaxDuration(maxDurationMinutes) {
    try {
      const allMicroactivities = await this.getAllForTimer();
      return allMicroactivities.filter(activity => 
        activity.durationMinutes <= maxDurationMinutes
      );
    } catch (error) {
      console.error('Error en MicroactivityTimerService.getByMaxDuration:', error);
      throw new Error(`Error filtrando por duración: ${error.message}`);
    }
  }
  async getByCategory(category) {
    try {
      const allMicroactivities = await this.getAllForTimer();
      return allMicroactivities.filter(activity => 
        activity.category.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error('Error en MicroactivityTimerService.getByCategory:', error);
      throw new Error(`Error filtrando por categoría: ${error.message}`);
    }
  }
  _adaptForTimer(rawMicroactivity) {
    return {
      id: rawMicroactivity.id,
      title: rawMicroactivity.title,
      description: rawMicroactivity.description,
      category: rawMicroactivity.category,
      durationMinutes: rawMicroactivity.duration, // Ya está en minutos después de nuestras correcciones
      shortDescription: this._createShortDescription(rawMicroactivity),
      difficulty: rawMicroactivity.difficulty || 'Fácil',
      tags: rawMicroactivity.tags || [],
      isQuickActivity: rawMicroactivity.duration <= 5,
      isLongActivity: rawMicroactivity.duration >= 30,
      estimatedPreparation: this._estimatePreparationTime(rawMicroactivity),
      timerCompatible: true
    };
  }
  _createShortDescription(microactivity) {
    if (microactivity.description && microactivity.description.length > 100) {
      return microactivity.description.substring(0, 97) + '...';
    }
    return microactivity.description || 'Microactividad de bienestar';
  }
  _estimatePreparationTime(microactivity) {
    const category = microactivity.category?.toLowerCase() || '';
    if (category.includes('meditation') || category.includes('breathing')) {
      return 1; // 1 minuto de preparación
    }
    if (category.includes('exercise') || category.includes('movement')) {
      return 2; // 2 minutos de preparación
    }
    return 0.5; // 30 segundos por defecto
  }
  clearCache() {
    this.cache.clear();
  }
  isCompatibleWithTimer(microactivity, timerDurationMinutes) {
    return microactivity.durationMinutes <= (timerDurationMinutes * 0.8);
  }
  _getMockMicroactivities() {
    return [
      {
        id: 1,
        title: 'Respiración Profunda',
        description: 'Ejercicio simple de respiración para relajar la mente y el cuerpo.',
        category: 'respiración',
        durationMinutes: 3,
        shortDescription: 'Ejercicio simple de respiración para relajar la mente y el cuerpo.',
        difficulty: 'Fácil',
        tags: ['respiración', 'relajación'],
        isQuickActivity: true,
        estimatedPreparationTime: 1,
        timerCompatibility: { maxDuration: 60, minDuration: 5 }
      },
      {
        id: 2,
        title: 'Estiramiento Básico',
        description: 'Serie de estiramientos suaves para aliviar la tensión muscular.',
        category: 'cuerpo',
        durationMinutes: 5,
        shortDescription: 'Serie de estiramientos suaves para aliviar la tensión muscular.',
        difficulty: 'Fácil',
        tags: ['estiramiento', 'movimiento'],
        isQuickActivity: true,
        estimatedPreparationTime: 0.5,
        timerCompatibility: { maxDuration: 60, minDuration: 10 }
      },
      {
        id: 3,
        title: 'Meditación Mindfulness',
        description: 'Práctica de atención plena para centrar la mente en el presente.',
        category: 'mente',
        durationMinutes: 7,
        shortDescription: 'Práctica de atención plena para centrar la mente en el presente.',
        difficulty: 'Intermedio',
        tags: ['meditación', 'mindfulness'],
        isQuickActivity: false,
        estimatedPreparationTime: 1,
        timerCompatibility: { maxDuration: 60, minDuration: 15 }
      }
    ];
  }
}
const microactivityTimerService = new MicroactivityTimerService();
export default microactivityTimerService;
