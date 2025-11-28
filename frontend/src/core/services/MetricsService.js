import { HistoryRepository } from '../repositories/HistoryRepository';
import { MoodRepository } from '../repositories/MoodRepository';
export class MetricsService {
  constructor() {
    this.historyRepository = new HistoryRepository();
    this.moodRepository = new MoodRepository();
  }
  async getUserMetrics(userId) {
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
    return 0;
  }
  getCategoriesDistribution(history) {
    return {};
  }
  getMoodEvolution(moodHistory) {
    return [];
  }
}
export default MetricsService;
