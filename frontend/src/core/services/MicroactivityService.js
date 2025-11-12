// Servicio de Microactividades
import { MicroactivityRepository } from '../repositories/MicroactivityRepository';

export class MicroactivityService {
  constructor() {
    this.repository = new MicroactivityRepository();
  }

  async getAllMicroactivities(filters = {}) {
    // TODO: Implementar obtención con filtros
    return this.repository.findAll(filters);
  }

  async getMicroactivityById(id) {
    return this.repository.findById(id);
  }

  async getByCategory(category) {
    return this.repository.findByCategory(category);
  }

  async searchMicroactivities(searchTerm) {
    return this.repository.search(searchTerm);
  }

  async getFavorites(userId) {
    return this.repository.findFavoritesByUser(userId);
  }

  async addToFavorites(userId, microactivityId) {
    return this.repository.addFavorite(userId, microactivityId);
  }

  async removeFromFavorites(userId, microactivityId) {
    return this.repository.removeFavorite(userId, microactivityId);
  }

  // Admin methods
  async createMicroactivity(data) {
    return this.repository.create(data);
  }

  async updateMicroactivity(id, data) {
    return this.repository.update(id, data);
  }

  async deleteMicroactivity(id) {
    return this.repository.delete(id);
  }
}

export default MicroactivityService;
