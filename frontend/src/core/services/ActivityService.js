import apiClient from '../../infrastructure/api/apiClient';
import MicroactivityService from './MicroactivityService';
import { ActivityHistory } from '../models/ActivityHistory';
export class ActivityService {
  constructor() {
    this.microactivityService = new MicroactivityService();
  }
  async getActivityForSession(id) {
    try {
      const microactivity = await this.microactivityService.getMicroactivityById(id);
      if (!microactivity) {
        throw new Error(`Microactividad con ID ${id} no encontrada`);
      }
      return this._adaptActivityForSession(microactivity);
    } catch (error) {
      console.error('Error obteniendo actividad para sesión:', error);
      throw new Error(`No se pudo cargar la actividad: ${error.message}`);
    }
  }
  async recordCompletedActivity(sessionData) {
    try {
      const {
        microactivityId,
        actualDuration,
        estimatedDuration,
        completedAt = new Date(),
        moodId = null,
        sessionEvents = [],
        checkpoints = []
      } = sessionData;
      if (!microactivityId) {
        throw new Error('ID de microactividad es requerido');
      }
      if (actualDuration < 0) {
        throw new Error('La duración actual no puede ser negativa');
      }
      const durationInMinutes = Math.floor(actualDuration / 60);
      const historyData = {
        microactivityId,
        duration: durationInMinutes,
        moodId,
        completedAt
      };
      const response = await apiClient.post('/activity-history', historyData);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Error al guardar actividad');
      }
      const historyEntry = new ActivityHistory({
        ...response.data.data,
        sessionMetadata: {
          estimatedDuration,
          actualDuration,
          completionRate: estimatedDuration > 0 ? (actualDuration / estimatedDuration) : 1,
          eventsCount: sessionEvents.length,
          checkpointsCount: checkpoints.length
        }
      });
      return historyEntry;
    } catch (error) {
      console.error('Error registrando actividad completada:', error);
      throw new Error(`No se pudo registrar la actividad: ${error.message}`);
    }
  }
  async getUserHistory(filters = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        startDate = null,
        endDate = null
      } = filters;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      if (startDate) {
        queryParams.append('startDate', startDate);
      }
      if (endDate) {
        queryParams.append('endDate', endDate);
      }
      const response = await apiClient.get(`/activity-history?${queryParams.toString()}`);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Error al obtener historial');
      }
      const adaptedHistory = {
        ...response.data.data,
        activities: response.data.data.activities.map(activity => 
          this._adaptHistoryEntry(activity)
        )
      };
      return adaptedHistory;
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      throw new Error(`No se pudo obtener el historial: ${error.message}`);
    }
  }
  async getUserStatistics() {
    try {
      const response = await apiClient.get('/activity-history/stats');
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Error al obtener estadísticas');
      }
      return this._adaptUserStatistics(response.data.data);
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw new Error(`No se pudieron obtener las estadísticas: ${error.message}`);
    }
  }
  async checkActivityCompletion(microactivityId) {
    try {
      const response = await apiClient.get(`/activity-history/check/${microactivityId}`);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Error al verificar actividad');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error verificando completación:', error);
      return { hasCompleted: false, error: error.message };
    }
  }
  async getRecommendations() {
    try {
      const history = await this.getUserHistory({ limit: 10 });
      const allActivities = await this.microactivityService.getAll();
      return this._generateRecommendations(history.activities, allActivities);
    } catch (error) {
      console.error('Error obteniendo recomendaciones:', error);
      return [];
    }
  }
  async getActivityMetrics(microactivityId) {
    try {
      const history = await this.getUserHistory();
      const activityHistory = history.activities.filter(
        entry => entry.microactivityId === microactivityId
      );
      if (activityHistory.length === 0) {
        return {
          completionCount: 0,
          averageDuration: 0,
          bestTime: 0,
          lastCompleted: null,
          improvementTrend: 'none'
        };
      }
      const completionCount = activityHistory.length;
      const durations = activityHistory.map(entry => entry.duration);
      const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      const bestTime = Math.min(...durations);
      const lastCompleted = new Date(Math.max(
        ...activityHistory.map(entry => new Date(entry.completedAt).getTime())
      ));
      const improvementTrend = this._calculateImprovementTrend(durations);
      return {
        completionCount,
        averageDuration: Math.round(averageDuration),
        bestTime,
        lastCompleted,
        improvementTrend
      };
    } catch (error) {
      console.error('Error obteniendo métricas de actividad:', error);
      return null;
    }
  }
  _adaptActivityForSession(microactivity) {
    console.log('🔧 ActivityService._adaptActivityForSession - Microactividad original:', microactivity);
    let estimatedDuration = microactivity.estimatedDuration || microactivity.duration * 60 || 300;
    console.log('⏱️ Duración determinada:', {
      durationMinutes: microactivity.duration,
      estimatedDurationSeconds: microactivity.estimatedDuration, 
      finalTimerSeconds: estimatedDuration
    });
    const adapted = {
      ...microactivity,
      sessionConfig: {
        timerType: this._getTimerType(microactivity.category),
        allowPause: true,
        showProgress: true,
        showBreathing: microactivity.category?.toLowerCase().includes('meditation')
      },
      estimatedDuration: estimatedDuration
    };
    console.log('✅ Actividad adaptada para sesión:', adapted);
    return adapted;
  }
  _adaptHistoryEntry(historyData) {
    return {
      ...historyData,
      completedAtFormatted: new Date(historyData.completedAt).toLocaleDateString(),
      durationFormatted: this._formatDuration(historyData.duration),
      metadata: {
        isRecent: this._isRecentActivity(historyData.completedAt),
        performanceScore: this._calculatePerformanceScore(historyData)
      }
    };
  }
  _adaptUserStatistics(statsData) {
    return {
      ...statsData,
      totalActivities: parseInt(statsData.totalActivities) || 0,
      totalTime: parseInt(statsData.totalTime) || 0,
      uniqueActivities: parseInt(statsData.uniqueActivities) || 0,
      activeDays: parseInt(statsData.activeDays) || 0,
      averageSessionLength: statsData.totalActivities > 0 
        ? Math.round(statsData.totalTime / statsData.totalActivities) 
        : 0,
      totalTimeFormatted: this._formatDuration(statsData.totalTime),
      consistency: this._calculateConsistency(statsData),
      achievements: this._calculateAchievements(statsData)
    };
  }
  _getTimerType(category) {
    if (!category) return 'countdown';
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('meditation') || categoryLower.includes('mindfulness')) {
      return 'meditation';
    }
    if (categoryLower.includes('focus') || categoryLower.includes('productivity')) {
      return 'interval';
    }
    return 'countdown';
  }
  _formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  }
  _isRecentActivity(completedAt) {
    const now = new Date();
    const activityDate = new Date(completedAt);
    const diffHours = (now - activityDate) / (1000 * 60 * 60);
    return diffHours < 24;
  }
  _calculatePerformanceScore(historyData) {
    if (!historyData.estimatedDuration) return 1;
    const ratio = historyData.duration / historyData.estimatedDuration;
    if (ratio >= 0.9 && ratio <= 1.1) return 1; // Excelente
    if (ratio >= 0.8 && ratio <= 1.2) return 0.8; // Bueno
    if (ratio >= 0.7 && ratio <= 1.3) return 0.6; // Regular
    return 0.4; // Necesita mejora
  }
  _calculateConsistency(stats) {
    if (stats.totalActivities === 0 || stats.activeDays === 0) return 0;
    return Math.min(1, stats.activeDays / (stats.totalActivities * 0.3));
  }
  _calculateAchievements(stats) {
    const achievements = [];
    if (stats.totalActivities >= 1) achievements.push('first_activity');
    if (stats.totalActivities >= 10) achievements.push('dedication');
    if (stats.totalActivities >= 50) achievements.push('commitment');
    if (stats.totalActivities >= 100) achievements.push('master');
    if (stats.activeDays >= 7) achievements.push('weekly_streak');
    if (stats.activeDays >= 30) achievements.push('monthly_streak');
    if (stats.uniqueActivities >= 5) achievements.push('explorer');
    if (stats.uniqueActivities >= 10) achievements.push('variety_seeker');
    return achievements;
  }
  _calculateImprovementTrend(durations) {
    if (durations.length < 2) return 'insufficient_data';
    const firstHalf = durations.slice(0, Math.ceil(durations.length / 2));
    const secondHalf = durations.slice(Math.floor(durations.length / 2));
    const firstAvg = firstHalf.reduce((sum, d) => sum + d, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d, 0) / secondHalf.length;
    const improvement = (firstAvg - secondAvg) / firstAvg;
    if (improvement > 0.1) return 'improving';
    if (improvement < -0.1) return 'declining';
    return 'stable';
  }
  _generateRecommendations(userHistory, allActivities) {
    const recentCategories = userHistory
      .slice(0, 5)
      .map(entry => entry.category)
      .filter(Boolean);
    const recentIds = userHistory
      .slice(0, 5)
      .map(entry => entry.microactivityId);
    const candidates = allActivities.filter(activity => 
      !recentIds.includes(activity.id)
    );
    const diverseCandidates = candidates.filter(activity => 
      !recentCategories.includes(activity.category)
    );
    const recommendations = diverseCandidates.length > 0 
      ? diverseCandidates.slice(0, 3)
      : candidates.slice(0, 3);
    return recommendations.map(activity => ({
      ...activity,
      recommendationReason: this._getRecommendationReason(activity, userHistory)
    }));
  }
  _getRecommendationReason(activity, userHistory) {
    const categoryCount = userHistory.filter(
      entry => entry.category === activity.category
    ).length;
    if (categoryCount === 0) {
      return `Nuevo: Prueba algo de ${activity.category}`;
    }
    if (categoryCount < 3) {
      return `Popular: Continúa explorando ${activity.category}`;
    }
    return 'Recomendado para ti';
  }
}
export default ActivityService;
