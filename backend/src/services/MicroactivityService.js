const logger = require('../utils/logger');
const VALID_CATEGORIES = ['Mente', 'Creatividad', 'Cuerpo'];
const MIN_SEARCH_TERM_LENGTH = 2;
const MAX_DURATION = 60;
const MIN_DURATION = 1;
class MicroactivityService {
  constructor(microactivityRepository) {
    this.repository = microactivityRepository;
  }
  async getAllMicroactivities(filters) {
    try {
      const { category, search, page = 1, limit = 10 } = filters;
      const validatedPage = Math.max(1, parseInt(page));
      const validatedLimit = Math.min(100, Math.max(1, parseInt(limit)));
      return await this.repository.findAll({
        category,
        search,
        page: validatedPage,
        limit: validatedLimit
      });
    } catch (error) {
      logger.error('Error en servicio getAllMicroactivities:', error);
      throw error;
    }
  }
  async getMicroactivityById(id) {
    try {
      this.validateId(id);
      return await this.repository.findById(id);
    } catch (error) {
      logger.error('Error en servicio getMicroactivityById:', error);
      throw error;
    }
  }
  async createMicroactivity(data, userId) {
    try {
      this.validateCreateData(data);
      const microactivityData = {
        ...data,
        createdBy: userId,
        createdAt: new Date()
      };
      const result = await this.repository.create(microactivityData);
      logger.info(`Nueva microactividad creada: ${data.title} por usuario ${userId}`);
      return result;
    } catch (error) {
      logger.error('Error en servicio createMicroactivity:', error);
      throw error;
    }
  }
  async updateMicroactivity(id, data, userId) {
    try {
      this.validateId(id);
      const existing = await this.repository.findById(id);
      if (!existing) {
        const error = new Error('Microactividad no encontrada');
        error.status = 404;
        throw error;
      }
      this.validateUpdateData(data);
      const updateData = {
        title: data.title,
        description: data.description,
        category: data.category,
        duration: data.duration,
        concentration_time: data.concentration_time,
        steps: data.steps,
        image_url: data.image_url,
        requirements: data.requirements,
        benefits: data.benefits
      };
      const result = await this.repository.update(id, updateData);
      logger.info(`Microactividad actualizada: ID ${id} por usuario ${userId}`);
      return result;
    } catch (error) {
      logger.error('Error en servicio updateMicroactivity:', error);
      throw error;
    }
  }
  async deleteMicroactivity(id, userId) {
    try {
      this.validateId(id);
      const existing = await this.repository.findById(id);
      if (!existing) {
        const error = new Error('Microactividad no encontrada');
        error.status = 404;
        throw error;
      }
      const result = await this.repository.delete(id);
      logger.info(`Microactividad eliminada: ID ${id} por usuario ${userId}`);
      return result;
    } catch (error) {
      logger.error('Error en servicio deleteMicroactivity:', error);
      throw error;
    }
  }
  async searchMicroactivities(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim().length < MIN_SEARCH_TERM_LENGTH) {
        const error = new Error(`Término de búsqueda debe tener al menos ${MIN_SEARCH_TERM_LENGTH} caracteres`);
        error.status = 400;
        throw error;
      }
      return await this.repository.search(searchTerm.trim());
    } catch (error) {
      logger.error('Error en servicio searchMicroactivities:', error);
      throw error;
    }
  }
  async getStatistics() {
    try {
      return await this.repository.getStatistics();
    } catch (error) {
      logger.error('Error en servicio getStatistics:', error);
      throw error;
    }
  }
  validateId(id) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
      const error = new Error('ID de microactividad inválido');
      error.status = 400;
      throw error;
    }
  }
  validateCreateData(data) {
    const { title, description, category, duration } = data;
    if (!title || !description || !category || !duration) {
      const error = new Error('Faltan campos obligatorios: title, description, category, duration');
      error.status = 400;
      throw error;
    }
    this.validateCategory(category);
    this.validateDuration(duration);
  }
  validateUpdateData(data) {
    if (data.category) {
      this.validateCategory(data.category);
    }
    if (data.duration) {
      this.validateDuration(data.duration);
    }
  }
  validateCategory(category) {
    if (!VALID_CATEGORIES.includes(category)) {
      const error = new Error(`Categoría inválida. Debe ser una de: ${VALID_CATEGORIES.join(', ')}`);
      error.status = 400;
      throw error;
    }
  }
  validateDuration(duration) {
    const numDuration = parseInt(duration);
    if (isNaN(numDuration) || numDuration < MIN_DURATION || numDuration > MAX_DURATION) {
      const error = new Error(`La duración debe ser un número entre ${MIN_DURATION} y ${MAX_DURATION} minutos`);
      error.status = 400;
      throw error;
    }
  }
}
module.exports = MicroactivityService;
