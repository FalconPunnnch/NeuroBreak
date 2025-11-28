import ApiService from 'infrastructure/api/ApiService';
import MoodService from './MoodService';
class StudentDashboardService {
  constructor() {
    this.apiService = ApiService;
    this.moodService = new MoodService();
  }
  async getStudentStats() {
    try {
      const response = await this.apiService.get('/activity-history/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas del estudiante:', error);
      return {
        success: false,
        error: error.message,
        data: this.getDefaultStats()
      };
    }
  }
  async getActivityHistory(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      const response = await this.apiService.get(`/activity-history?${params}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo historial de actividades:', error);
      return {
        success: false,
        error: error.message,
        data: {
          activities: [],
          totalCount: 0,
          currentPage: page,
          totalPages: 0
        }
      };
    }
  }
  async getMoodHistory(dateRange = '7d') {
    try {
      const response = await this.apiService.get('/moods');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo historial de moods:', error);
      return {
        success: false,
        error: error.message,
        data: {
          moods: [],
          statistics: this.getDefaultMoodStats()
        }
      };
    }
  }
  async getProgressMetrics() {
    try {
      const response = await this.apiService.get('/moods/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo métricas de progreso:', error);
      return {
        success: false,
        error: error.message,
        data: this.getDefaultProgressMetrics()
      };
    }
  }
  async getRecentActivities() {
    try {
      const response = await this.apiService.get('/activity-history/recent?limit=5');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo actividades recientes:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
  async getWeeklySummary() {
    try {
      const response = await this.apiService.get('/activity-history?limit=50');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo resumen semanal:', error);
      return {
        success: false,
        error: error.message,
        data: this.getDefaultWeeklySummary()
      };
    }
  }
  getDefaultStats() {
    return {
      completed: 0,
      totalTime: 0,
      streak: 0,
      weeklyProgress: 0,
      totalActivities: 0,
      completedToday: 0,
      currentStreak: 0,
      totalTimeSpent: 0,
      favoriteCategory: 'Aún no definida'
    };
  }
  getDefaultMoodStats() {
    return {
      average: 3,
      distribution: {
        very_happy: 0,
        happy: 0,
        neutral: 0,
        sad: 0,
        very_sad: 0
      },
      trend: 'stable'
    };
  }
  getDefaultProgressMetrics() {
    return {
      weeklyGoal: 5,
      completedThisWeek: 0,
      improvement: 0,
      consistencyScore: 0
    };
  }
  getDefaultWeeklySummary() {
    return {
      activitiesCompleted: 0,
      timeSpent: 0,
      moodAverage: 3,
      achievements: [],
      suggestions: [
        'Comienza tu primer descanso activo',
        'Establece una rutina diaria',
        'Explora diferentes categorías de actividades'
      ]
    };
  }
}
export default StudentDashboardService;
