class DashboardService {
  constructor() {
    this.baseURL = 'http://localhost:3001/api';
  }
  getAuthToken() {
    return localStorage.getItem('token');
  }
  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }
  async getActivityHistory(limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/activity-history?limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data?.activities || [];
    } catch (error) {
      console.error('Error fetching activity history:', error);
      return [];
    }
  }
  async getMoodHistory(limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/moods?limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      if (!response.ok) {
        return []; // Return empty array on error
      }
      const data = await response.json();
      if (data.success && data.data && Array.isArray(data.data.entries)) {
        return data.data.entries;
      } else if (data.success && Array.isArray(data.data)) {
        return data.data;
      } else if (Array.isArray(data.data)) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching mood history:', error);
      return [];
    }
  }
  async getDashboardStats() {
    try {
      const [activityHistory, moodHistory] = await Promise.all([
        this.getActivityHistory(100),
        this.getMoodHistory(100)
      ]);
      const safeMoodHistory = Array.isArray(moodHistory) ? moodHistory : [];
      const totalTime = activityHistory.reduce((sum, activity) => sum + (activity.duration || 0), 0);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentActivities = activityHistory.filter(activity => {
        const activityDate = new Date(activity.completedAt || activity.created_at);
        return activityDate >= weekAgo;
      });
      return {
        totalActivities: activityHistory.length,
        totalTime: totalTime, // Keep in minutes as our data is already in minutes
        totalMoods: safeMoodHistory.length,
        weeklyActivities: recentActivities.length,
        recentActivities: activityHistory.slice(0, 5),
        recentMoods: safeMoodHistory.slice(0, 5)
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      return {
        totalActivities: 0,
        totalTime: 0,
        totalMoods: 0,
        weeklyActivities: 0,
        recentActivities: [],
        recentMoods: []
      };
    }
  }
}
export default DashboardService;
