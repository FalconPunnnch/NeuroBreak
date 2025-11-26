import apiClient from '../../infrastructure/api/apiClient';
export class HistoryRepository {
  async create(historyEntry) {
    const response = await apiClient.post('/activity-history', historyEntry);
    return response.data;
  }
  async findByUser(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    const queryString = params.toString();
    const url = queryString ? `/activity-history?${queryString}` : '/activity-history';
    const response = await apiClient.get(url);
    return response.data;
  }
  async findById(id) {
    const response = await apiClient.get(`/activity-history/${id}`);
    return response.data;
  }
  async getUserStats() {
    const response = await apiClient.get('/activity-history/stats');
    return response.data;
  }
  async checkActivityCompletion(microactivityId) {
    const response = await apiClient.get(`/activity-history/check/${microactivityId}`);
    return response.data;
  }
  async findBySpecificUser(userId, filters = {}) {
    const params = new URLSearchParams();
    params.append('userId', userId.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    const response = await apiClient.get(`/activity-history?${params.toString()}`);
    return response.data;
  }
}
export default HistoryRepository;
