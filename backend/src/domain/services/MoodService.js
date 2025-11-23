const MoodRepository = require('../repositories/MoodRepository');
const MicroactivityRepository = require('../repositories/MicroactivityRepository');
class MoodService {
  constructor(
    moodRepository = new MoodRepository(),
    microactivityRepository = new MicroactivityRepository()
  ) {
    this.moodRepository = moodRepository;
    this.microactivityRepository = microactivityRepository;
  }
  async createMoodEntry(moodData) {
    try {
      const microactivity = await this.microactivityRepository.findById(moodData.microactivityId);
      if (!microactivity) {
        throw new Error('La microactividad especificada no existe');
      }
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);
      const existingEntries = await this.moodRepository.findByUser({
        userId: moodData.userId,
        microactivityId: moodData.microactivityId,
        startDate: startOfDay,
        endDate: endOfDay,
        limit: 1
      });
      if (existingEntries.length > 0) {
        console.log(`Usuario ${moodData.userId} ya tiene una entrada para la actividad ${moodData.microactivityId} hoy`);
      }
      const moodEntry = await this.moodRepository.create(moodData);
      return moodEntry;
    } catch (error) {
      if (error.message.includes('microactividad')) {
        throw error; // Re-throw business logic errors
      }
      throw new Error(`Error al crear entrada de estado emocional: ${error.message}`);
    }
  }
  async getMoodEntriesByUser(filters) {
    try {
      const [entries, totalCount] = await Promise.all([
        this.moodRepository.findByUser(filters),
        this.moodRepository.countByUser(filters.userId, filters)
      ]);
      const totalPages = Math.ceil(totalCount / (filters.limit || 10));
      const currentPage = Math.floor((filters.offset || 0) / (filters.limit || 10)) + 1;
      return {
        entries,
        pagination: {
          total: totalCount,
          totalPages,
          currentPage,
          limit: filters.limit || 10,
          offset: filters.offset || 0,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener entradas de estado emocional: ${error.message}`);
    }
  }
  async getMoodStats(userId, days = 7) {
    try {
      const [stats, totalEntries] = await Promise.all([
        this.moodRepository.getMoodStats(userId, days),
        this.moodRepository.countByUser(userId, {
          startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        })
      ]);
      const insights = this.calculateMoodInsights(stats, totalEntries, days);
      return {
        period: {
          days,
          totalEntries,
          averagePerDay: parseFloat((totalEntries / days).toFixed(2))
        },
        distribution: stats,
        insights
      };
    } catch (error) {
      throw new Error(`Error al calcular estadísticas de estado emocional: ${error.message}`);
    }
  }
  async deleteMoodEntry(entryId, userId) {
    try {
      const entry = await this.moodRepository.findByIdAndUser(entryId, userId);
      if (!entry) {
        throw new Error('Entrada de estado emocional no encontrada o no autorizada');
      }
      const deleted = await this.moodRepository.deleteByIdAndUser(entryId, userId);
      if (!deleted) {
        throw new Error('No se pudo eliminar la entrada de estado emocional');
      }
      return true;
    } catch (error) {
      if (error.message.includes('encontrada') || error.message.includes('autorizada')) {
        throw error; // Re-throw business logic errors
      }
      throw new Error(`Error al eliminar entrada de estado emocional: ${error.message}`);
    }
  }
  calculateMoodInsights(stats, totalEntries, days) {
    if (totalEntries === 0) {
      return {
        dominantMood: null,
        moodTrend: 'insufficient_data',
        recommendation: 'Registra más estados emocionales para obtener insights personalizados'
      };
    }
    const dominantMood = stats.length > 0 ? stats[0] : null;
    const positiveMoods = ['very_happy', 'happy'];
    const negativeMoods = ['sad', 'very_sad'];
    const positiveCount = stats
      .filter(s => positiveMoods.includes(s.mood))
      .reduce((sum, s) => sum + parseInt(s.count), 0);
    const negativeCount = stats
      .filter(s => negativeMoods.includes(s.mood))
      .reduce((sum, s) => sum + parseInt(s.count), 0);
    let moodTrend = 'stable';
    if (positiveCount > negativeCount * 1.5) {
      moodTrend = 'positive';
    } else if (negativeCount > positiveCount * 1.5) {
      moodTrend = 'negative';
    }
    let recommendation = 'Continúa registrando tus estados emocionales para un mejor seguimiento';
    if (moodTrend === 'positive') {
      recommendation = '¡Excelente! Tus estados emocionales muestran una tendencia positiva. Sigue así.';
    } else if (moodTrend === 'negative') {
      recommendation = 'Considera tomar descansos más frecuentes o probar diferentes tipos de microactividades.';
    } else if (dominantMood?.mood === 'neutral') {
      recommendation = 'Podrías explorar actividades que te generen más satisfacción y bienestar.';
    }
    return {
      dominantMood: dominantMood?.mood || null,
      moodTrend,
      recommendation,
      positiveRatio: totalEntries > 0 ? parseFloat(((positiveCount / totalEntries) * 100).toFixed(1)) : 0,
      negativeRatio: totalEntries > 0 ? parseFloat(((negativeCount / totalEntries) * 100).toFixed(1)) : 0
    };
  }
}
module.exports = MoodService;
