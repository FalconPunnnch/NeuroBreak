// Servicio de Métricas
import { HistoryRepository } from '../repositories/HistoryRepository';
import { MoodRepository } from '../repositories/MoodRepository';

export class MetricsService {
  constructor() {
    this.historyRepository = new HistoryRepository();
    this.moodRepository = new MoodRepository();
  }

  async getUserMetrics(userId) {
    // TODO: Implementar cálculo de métricas
    const history = await this.historyRepository.findByUser(userId);
    const moodHistory = await this.moodRepository.findByUser(userId);

    return {
      totalActivities: history.length,
      totalTime: this.calculateTotalTime(history),
      currentStreak: this.calculateStreak(history),
      categoriesUsed: this.getCategoriesDistribution(history),
      moodEvolution: this.getMoodEvolution(moodHistory)
    };
  }

  calculateTotalTime(history) {
    return history.reduce((sum, entry) => sum + entry.duration, 0);
  }

  calculateStreak(history) {
    // TODO: Implementar cálculo de racha
    return 0;
  }

  getCategoriesDistribution(history) {
    // TODO: Implementar distribución por categorías
    return {};
  }

  getMoodEvolution(moodHistory) {
    // TODO: Implementar evolución del estado de ánimo
    return [];
  }
}

export default MetricsService;
