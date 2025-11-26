import { MoodRepository } from '../repositories/MoodRepository';

export class MoodService {
  constructor() {
    this.repository = new MoodRepository();
  }

  static MOOD_TYPES = {
    VERY_HAPPY: { value: 'very_happy', emoji: '😄', label: 'Muy feliz' },
    HAPPY: { value: 'happy', emoji: '😊', label: 'Feliz' },
    NEUTRAL: { value: 'neutral', emoji: '😐', label: 'Neutral' },
    SAD: { value: 'sad', emoji: '😔', label: 'Triste' },
    VERY_SAD: { value: 'very_sad', emoji: '😭', label: 'Muy triste' }
  };

  static MOOD_OPTIONS = Object.values(MoodService.MOOD_TYPES);

  async saveMood(microactivityId, moodValue) {
    try {
      const moodType = this.getMoodTypeByValue(moodValue);
      if (!moodType) {
        throw new Error('Tipo de estado emocional inválido');
      }

      if (!microactivityId || typeof microactivityId !== 'number') {
        throw new Error('ID de microactividad inválido');
      }

      const moodData = {
        microactivityId,
        mood: moodType.value,
        emoji: moodType.emoji
      };

      const result = await this.repository.create(moodData);
      
      this.logMoodRegistration(moodType.value, microactivityId);
      
      return {
        success: true,
        data: result.data,
        message: result.message || 'Estado emocional registrado exitosamente'
      };

    } catch (error) {
      console.error('Error saving mood:', error);
      throw new Error(`Error al guardar estado emocional: ${error.message}`);
    }
  }

  async getMoodHistory(options = {}) {
    try {
      const {
        limit = 10,
        offset = 0,
        microactivityId,
        days
      } = options;

      const filters = {
        limit,
        offset,
        ...(microactivityId && { microactivityId }),
        ...(days && { 
          startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
        })
      };

      const result = await this.repository.findByUser(filters);
      
      return {
        success: true,
        data: {
          entries: result.data?.entries || [],
          pagination: result.data?.pagination || {}
        }
      };

    } catch (error) {
      console.error('Error getting mood history:', error);
      throw new Error(`Error al obtener historial de emociones: ${error.message}`);
    }
  }

  async getMoodStatistics(days = 7) {
    try {
      const result = await this.repository.getStatistics(days);
      
      return {
        success: true,
        data: result.data || {}
      };

    } catch (error) {
      console.error('Error getting mood statistics:', error);
      throw new Error(`Error al obtener estadísticas de emociones: ${error.message}`);
    }
  }

  async deleteMood(entryId) {
    try {
      if (!entryId || typeof entryId !== 'number') {
        throw new Error('ID de entrada inválido');
      }

      const result = await this.repository.delete(entryId);
      
      return {
        success: true,
        message: result.message || 'Estado emocional eliminado exitosamente'
      };

    } catch (error) {
      console.error('Error deleting mood:', error);
      throw new Error(`Error al eliminar estado emocional: ${error.message}`);
    }
  }

  getMoodTypeByValue(value) {
    return MoodService.MOOD_OPTIONS.find(mood => mood.value === value) || null;
  }

  getMoodTypeByEmoji(emoji) {
    return MoodService.MOOD_OPTIONS.find(mood => mood.emoji === emoji) || null;
  }

  isValidMood(moodValue) {
    return !!this.getMoodTypeByValue(moodValue);
  }

  getMoodOptions() {
    return [...MoodService.MOOD_OPTIONS];
  }

  logMoodRegistration(mood, microactivityId) {
    console.log(`Mood registered: ${mood} for microactivity ${microactivityId}`);
  }

  async syncMoods(moodEntries) {
    try {
      if (!Array.isArray(moodEntries) || moodEntries.length === 0) {
        throw new Error('Entradas de estado emocional inválidas para sincronización');
      }

      const validatedEntries = moodEntries.map(entry => {
        if (!this.isValidMood(entry.mood)) {
          throw new Error(`Estado emocional inválido: ${entry.mood}`);
        }
        return entry;
      });

      const result = await this.repository.createBatch(validatedEntries);
      
      return {
        success: true,
        data: result,
        message: `Sincronizados ${result.successful} estados emocionales`
      };

    } catch (error) {
      console.error('Error syncing moods:', error);
      throw new Error(`Error al sincronizar estados emocionales: ${error.message}`);
    }
  }
}

export default MoodService;
