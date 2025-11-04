// Repository Pattern: Microactividad
import apiClient from '../../infrastructure/api/apiClient';

export class MicroactivityRepository {
  async findAll(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(/microactivities?{params});
    return response.data;
  }

  async findById(id) {
    const response = await apiClient.get(/microactivities/{id});
    return response.data;
  }

  async findByCategory(category) {
    const response = await apiClient.get(/microactivities?category={category});
    return response.data;
  }

  async search(searchTerm) {
    const response = await apiClient.get(/microactivities/search?q={searchTerm});
    return response.data;
  }

  async findFavoritesByUser(userId) {
    const response = await apiClient.get(/users/{userId}/favorites);
    return response.data;
  }

  async addFavorite(userId, microactivityId) {
    const response = await apiClient.post(/users/{userId}/favorites, {
      microactivityId
    });
    return response.data;
  }

  async removeFavorite(userId, microactivityId) {
    const response = await apiClient.delete(
      /users/{userId}/favorites/{microactivityId}
    );
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post('/microactivities', data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.put(/microactivities/{id}, data);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(/microactivities/{id});
    return response.data;
  }
}

export default MicroactivityRepository;
