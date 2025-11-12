// Servicio de Estado de Ánimo
import { MoodRepository } from '../repositories/MoodRepository';

export class MoodService {
  constructor() {
    this.repository = new MoodRepository();
  }

  async saveMood(userId, microactivityId, mood) {
    const moodEntry = {
      userId,
      microactivityId,
      mood: mood.value,
      emoji: mood.emoji,
      timestamp: new Date()
    };
    return this.repository.create(moodEntry);
  }

  async getMoodHistory(userId, filters = {}) {
    return this.repository.findByUser(userId, filters);
  }

  async getMoodStatistics(userId) {
    return this.repository.getStatistics(userId);
  }
}

export default MoodService;
