import { MicroactivityRepository } from '../repositories/MicroactivityRepository';
import { CATEGORIES } from 'config/constants';
export class MicroactivityService {
  constructor(repositoryInstance = null) {
    this.repository = repositoryInstance || new MicroactivityRepository();
  }
  async getAllMicroactivities(filters = {}) {
    try {
      const result = await this.repository.findAll(filters);
      return this.transformMicroactivitiesList(result);
    } catch (error) {
      throw this.handleServiceError(error, 'Error al obtener microactividades');
    }
  }
  async getMicroactivityById(id) {
    try {
      const result = await this.repository.findById(id);
      const microactivity = result.data || result;
      return this.transformMicroactivity(microactivity);
    } catch (error) {
      throw this.handleServiceError(error, 'Error al obtener microactividad');
    }
  }
  async getByCategory(category) {
    try {
      const result = await this.repository.findByCategory(category);
      return result.data?.map(item => this.transformMicroactivity(item)) || [];
    } catch (error) {
      throw this.handleServiceError(error, 'Error al obtener por categor�a');
    }
  }
  async searchMicroactivities(searchTerm) {
    try {
      const result = await this.repository.search(searchTerm);
      return result.data?.map(item => this.transformMicroactivity(item)) || [];
    } catch (error) {
      throw this.handleServiceError(error, 'Error en b�squeda');
    }
  }
  async getFavorites(userId) {
    try {
      const result = await this.repository.findFavoritesByUser(userId);
      return result.data?.map(item => this.transformMicroactivity(item)) || [];
    } catch (error) {
      throw this.handleServiceError(error, 'Error al obtener favoritos');
    }
  }
  async addToFavorites(userId, microactivityId) {
    try {
      return await this.repository.addFavorite(userId, microactivityId);
    } catch (error) {
      throw this.handleServiceError(error, 'Error al agregar a favoritos');
    }
  }
  async removeFromFavorites(userId, microactivityId) {
    try {
      return await this.repository.removeFavorite(userId, microactivityId);
    } catch (error) {
      throw this.handleServiceError(error, 'Error al remover de favoritos');
    }
  }
  async createMicroactivity(data) {
    try {
      const processedData = this.preprocessCreateData(data);
      const result = await this.repository.create(processedData);
      return this.transformMicroactivity(result);
    } catch (error) {
      throw this.handleServiceError(error, 'Error al crear microactividad');
    }
  }
  async updateMicroactivity(id, data) {
    try {
      const processedData = this.preprocessUpdateData(data);
      const result = await this.repository.update(id, processedData);
      return this.transformMicroactivity(result);
    } catch (error) {
      throw this.handleServiceError(error, 'Error al actualizar microactividad');
    }
  }
  async deleteMicroactivity(id) {
    try {
      await this.repository.delete(id);
      return true;
    } catch (error) {
      throw this.handleServiceError(error, 'Error al eliminar microactividad');
    }
  }
  async getStatistics() {
    try {
      const result = await this.repository.getStats();
      return this.processResponse(result, 'Estad�sticas obtenidas');
    } catch (error) {
      this.logError('getStatistics', error);
      throw this.createError('Error al obtener estad�sticas', error);
    }
  }
  transformMicroactivitiesList(result) {
    return {
      ...result,
      data: result.data?.map(item => this.transformMicroactivity(item)) || []
    };
  }
  transformMicroactivity(microactivity) {
    if (!microactivity) return null;
    return {
      ...microactivity,
      imageUrl: microactivity.image_url || this.getDefaultImage(microactivity.category),
      createdAt: microactivity.created_at,
      updatedAt: microactivity.updated_at,
      concentrationTime: microactivity.concentration_time,
      steps: this.parseSteps(microactivity.steps),
      requirements: this.parseArray(microactivity.requirements),
      benefits: this.parseArray(microactivity.benefits),
      duration: microactivity.duration, // Mantener en minutos para mostrar
      estimatedDuration: microactivity.duration * 60, // Convertir a segundos para el timer
      durationFormatted: this.formatDuration(microactivity.duration),
      concentrationTimeFormatted: this.formatDuration(microactivity.concentration_time),
      categoryFormatted: this.formatCategory(microactivity.category)
    };
  }
  preprocessCreateData(data) {
    return {
      ...data,
      title: data.title?.trim(),
      description: data.description?.trim(),
      category: data.category, 
      duration: parseInt(data.duration),
      concentration_time: data.concentration_time ? parseInt(data.concentration_time) : null,
      steps: Array.isArray(data.steps) ? data.steps : [],
      requirements: Array.isArray(data.requirements) ? data.requirements : (data.requirements ? [data.requirements] : []),
      benefits: Array.isArray(data.benefits) ? data.benefits : (data.benefits ? [data.benefits] : [])
    };
  }
  preprocessUpdateData(data) {
    const processed = {};
    if (data.title) processed.title = data.title.trim();
    if (data.description) processed.description = data.description.trim();
    if (data.category) processed.category = data.category; 
    if (data.duration) processed.duration = parseInt(data.duration);
    if (data.concentration_time !== undefined) {
      processed.concentration_time = data.concentration_time ? parseInt(data.concentration_time) : null;
    }
    if (data.steps !== undefined) {
      processed.steps = Array.isArray(data.steps) ? data.steps : [];
    }
    if (data.requirements !== undefined) {
      processed.requirements = Array.isArray(data.requirements) ? data.requirements : (data.requirements ? [data.requirements] : []);
    }
    if (data.benefits !== undefined) {
      processed.benefits = Array.isArray(data.benefits) ? data.benefits : (data.benefits ? [data.benefits] : []);
    }
    return processed;
  }
  parseSteps(steps) {
    if (Array.isArray(steps)) return steps;
    if (typeof steps === 'string') {
      try { return JSON.parse(steps); } catch { return []; }
    }
    return [];
  }
  parseArray(arr) {
    if (Array.isArray(arr)) return arr;
    if (typeof arr === 'string') {
      try { 
        const parsed = JSON.parse(arr);
        return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
      } catch { return arr ? [arr] : []; }
    }
    return [];
  }
  formatDuration(duration) {
    if (!duration) return '0 min';
    const minutes = Math.floor(duration);
    const decimalPart = duration % 1;
    if (minutes >= 1) {
      if (decimalPart > 0) {
        return `${minutes}.${Math.floor(decimalPart * 60 / 10)} min`;
      } else {
        return `${minutes} min`;
      }
    } else {
      return 'Menos de 1 min';
    }
  }
  formatCategory(category) {
    const categoryMap = {
      [CATEGORIES.MIND]: CATEGORIES.MIND,
      [CATEGORIES.CREATIVITY]: CATEGORIES.CREATIVITY,
      [CATEGORIES.BODY]: CATEGORIES.BODY
    };
    return categoryMap[category] || category || 'Sin categor�a';
  }
  getDefaultImage(category) {
    const imageMap = {
      [CATEGORIES.MIND]: '/assets/images/default-focus.jpg',
      [CATEGORIES.CREATIVITY]: '/assets/images/default-creativity.jpg',
      [CATEGORIES.BODY]: '/assets/images/default-movement.jpg'
    };
    return imageMap[category] || '/assets/images/default-microactivity.jpg';
  }
  handleServiceError(error, defaultMessage) {
    if (error.message) return error;
    console.error(defaultMessage, error);
    return new Error(defaultMessage);
  }
  processResponse(result, message) {
    return {
      success: true,
      message: message || 'Operaci�n exitosa',
      data: result.data || result
    };
  }
  logError(method, error) {
    console.error(`Error en MicroactivityService.${method}:`, error);
  }
  createError(message, originalError) {
    const error = new Error(message);
    if (originalError) {
      error.originalError = originalError;
      error.stack = originalError.stack;
    }
    return error;
  }
}
export default MicroactivityService;
