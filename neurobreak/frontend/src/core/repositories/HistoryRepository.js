// Repository Pattern: Historial de Actividades
import apiClient from '../../infrastructure/api/apiClient';

export class HistoryRepository {
  async create(historyEntry) {
    const response = await apiClient.post('/history', historyEntry);
    return response.data;
  }

  async findByUser(userId, filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(/users/{userId}/history?{params});
    return response.data;
  }

  async findById(id) {
    const response = await apiClient.get(/history/{id});
    return response.data;
  }
}

export default HistoryRepository;
