const ActivityHistoryRepository = require('../repositories/ActivityHistoryRepository');
const { ValidationError, NotFoundError } = require('../utils/errors');
class ActivityHistoryService {
  constructor() {
    this.repository = new ActivityHistoryRepository();
  }
  async recordCompletedActivity(activityData) {
    const { userId, microactivityId, duration, moodId } = activityData;
    if (!userId || !microactivityId) {
      throw new ValidationError('Usuario y microactividad son requeridos');
    }
    if (duration < 0) {
      throw new ValidationError('La duración no puede ser negativa');
    }
    const historyEntry = await this.repository.create({
      userId,
      microactivityId,
      duration,
      moodId
    });
    return historyEntry;
  }
  async getUserHistory(userId, filters = {}) {
    if (!userId) {
      throw new ValidationError('ID de usuario requerido');
    }
    const { page = 1, limit = 20, startDate, endDate } = filters;
    const offset = (page - 1) * limit;
    const options = {
      limit: Math.min(limit, 100), // Máximo 100 elementos por página
      offset,
      startDate,
      endDate
    };
    const activities = await this.repository.findByUser(userId, options);
    const stats = await this.repository.getUserStats(userId);
    return {
      activities,
      stats,
      pagination: {
        page,
        limit,
        hasMore: activities.length === limit
      }
    };
  }
  async getUserStatistics(userId) {
    if (!userId) {
      throw new ValidationError('ID de usuario requerido');
    }
    const basicStats = await this.repository.getUserStats(userId);
    const recentActivities = await this.repository.findByUser(userId, { limit: 10 });
    return {
      ...basicStats,
      recentActivities: recentActivities.length,
      lastActivity: recentActivities[0]?.completedAt || null,
      averageSessionDuration: basicStats.totalActivities > 0 
        ? Math.round(basicStats.totalTime / basicStats.totalActivities) 
        : 0
    };
  }
  async checkActivityCompletion(userId, microactivityId) {
    if (!userId || !microactivityId) {
      throw new ValidationError('Usuario y microactividad requeridos');
    }
    const hasCompleted = await this.repository.hasCompletedActivity(userId, microactivityId);
    return {
      userId,
      microactivityId,
      hasCompleted,
      checkedAt: new Date()
    };
  }
  async getHistoryEntry(entryId, userId) {
    if (!entryId) {
      throw new ValidationError('ID de entrada requerido');
    }
    const entry = await this.repository.findById(entryId);
    if (!entry) {
      throw new NotFoundError('Entrada del historial no encontrada');
    }
    if (entry.userId !== userId) {
      throw new NotFoundError('Entrada del historial no encontrada');
    }
    return entry;
  }
}
module.exports = ActivityHistoryService;
