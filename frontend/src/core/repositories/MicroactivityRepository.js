import apiClient from '../../infrastructure/api/apiClient';
import { ENDPOINTS } from '../../infrastructure/api/endpoints';
import { CATEGORIES } from '../../config/constants';
export class MicroactivityRepository {
  constructor(apiClientInstance = null) {
    this.apiClient = apiClientInstance || apiClient;
  }
  async findAll(filters = {}) {
    try {
      const params = new URLSearchParams(this.sanitizeFilters(filters));
      const response = await this.apiClient.get(`${ENDPOINTS.MICROACTIVITIES}?${params}`);
      return this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Error al obtener microactividades');
    }
  }
  async findById(id) {
    try {
      this.validateId(id);
      const response = await this.apiClient.get(ENDPOINTS.MICROACTIVITY_BY_ID(id));
      return this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Error al obtener microactividad por ID');
    }
  }
  async findByCategory(category) {
    try {
      this.validateCategory(category);
      const response = await this.apiClient.get(`${ENDPOINTS.MICROACTIVITIES}?category=${encodeURIComponent(category)}`);
      return this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Error al obtener microactividades por categoría');
    }
  }
  async search(searchTerm) {
    try {
      this.validateSearchTerm(searchTerm);
      const response = await this.apiClient.get(`${ENDPOINTS.MICROACTIVITIES_SEARCH}?q=${encodeURIComponent(searchTerm)}`);
      return this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Error en búsqueda de microactividades');
    }
  }
  async getStats() {
    try {
      const response = await this.apiClient.get(ENDPOINTS.MICROACTIVITIES_STATS);
      return this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Error al obtener estadísticas');
    }
  }
  async findFavoritesByUser(userId) {
    try {
      this.validateId(userId);
      const response = await this.apiClient.get(ENDPOINTS.USER_FAVORITES(userId));
      return this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Error al obtener favoritos del usuario');
    }
  }
  async addFavorite(userId, microactivityId) {
    try {
      this.validateId(userId);
      this.validateId(microactivityId);
      const response = await this.apiClient.post(ENDPOINTS.USER_FAVORITES(userId), {
        microactivityId
      });
      return this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Error al agregar favorito');
    }
  }
  async removeFavorite(userId, microactivityId) {
    try {
      this.validateId(userId);
      this.validateId(microactivityId);
      const response = await this.apiClient.delete(
        `${ENDPOINTS.USER_FAVORITES(userId)}/${microactivityId}`
      );
      return this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Error al remover favorito');
    }
  }
  async create(data) {
    try {
      const response = await this.apiClient.post(ENDPOINTS.MICROACTIVITIES, data);
      return this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Error al crear microactividad');
    }
  }
  async update(id, data) {
    try {
      this.validateId(id);
      const response = await this.apiClient.put(ENDPOINTS.MICROACTIVITY_BY_ID(id), data);
      return this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Error al actualizar microactividad');
    }
  }
  async delete(id) {
    try {
      this.validateId(id);
      const response = await this.apiClient.delete(ENDPOINTS.MICROACTIVITY_BY_ID(id));
      return this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error, 'Error al eliminar microactividad');
    }
  }
  validateId(id) {
    if (!id || (typeof id !== 'number' && typeof id !== 'string')) {
      throw new Error('ID inválido');
    }
    if (typeof id === 'string' && isNaN(Number(id))) {
      throw new Error('ID debe ser numérico');
    }
  }
  validateSearchTerm(searchTerm) {
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length < 2) {
      throw new Error('El término de búsqueda debe tener al menos 2 caracteres');
    }
  }
  sanitizeFilters(filters) {
    const sanitized = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value !== null && value !== undefined && value !== '') {
        sanitized[key] = String(value).trim();
      }
    }
    return sanitized;
  }
  validateResponse(response) {
    if (!response || !response.data) {
      throw new Error('Respuesta inválida del servidor');
    }
    if (response.data.success) {
      return response.data; // Devuelve {success: true, data: [...], pagination: {...}}
    }
    return response.data;
  }
  handleError(error, defaultMessage) {
    if (error.message && !error.response) {
      return error;
    }
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      if (status === 401) {
        return new Error('No autorizado. Por favor inicia sesión.');
      } else if (status === 403) {
        return new Error('No tienes permisos para realizar esta acción.');
      } else if (status === 404) {
        return new Error('Recurso no encontrado.');
      } else if (data && data.message) {
        return new Error(data.message);
      }
    }
    return new Error(defaultMessage);
  }
}
export default MicroactivityRepository;
