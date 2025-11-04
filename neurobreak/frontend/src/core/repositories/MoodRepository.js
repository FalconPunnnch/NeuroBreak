// Repository Pattern: Estado de Ánimo
import apiClient from '../../infrastructure/api/apiClient';

export class MoodRepository {
  async create(moodEntry) {
    const response = await apiClient.post('/mood', moodEntry);
    return response.data;
  }

  async findByUser(userId, filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(/users/{userId}/mood?{params});
    return response.data;
  }

  async getStatistics(userId) {
    const response = await apiClient.get(/users/{userId}/mood/statistics);
    return response.data;
  }
}

export default MoodRepository;
