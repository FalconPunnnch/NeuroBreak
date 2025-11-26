import { MicroactivityService } from './MicroactivityService.js';
import { filterFactory } from '../../patterns/filters/FilterFactory.js';
export class CatalogService {
  constructor(microactivityServiceInstance = null) {
    this.microactivityService = microactivityServiceInstance || new MicroactivityService();
    this.filterFactory = filterFactory;
  }
  async getAllMicroactivities() {
    try {
      // Solicitar explícitamente un límite alto para el catálogo cuando se
      // piden todas las microactividades sin paginación desde la UI.
      // Esto evita tener que reiniciar el backend si está con el límite por
      // defecto en 10 en la instancia en ejecución.
      const response = await this.microactivityService.getAllMicroactivities({ limit: 1000 });
      return this.adaptMicroactivitiesForCatalog(response.data || []);
    } catch (error) {
      throw this.handleServiceError(error, 'Error al cargar el catálogo');
    }
  }
  async getMicroactivityById(id) {
    try {
      const microactivity = await this.microactivityService.getMicroactivityById(id);
      return this.adaptMicroactivityForDetail(microactivity);
    } catch (error) {
      throw this.handleServiceError(error, 'Error al cargar detalles de la microactividad');
    }
  }
  applyFilters(microactivities, filters = {}) {
    try {
      return this.filterFactory.applyMultipleFilters(microactivities, filters);
    } catch (error) {
      console.warn('Error aplicando filtros:', error.message);
      return microactivities;
    }
  }
  getFilterOptions() {
    return this.filterFactory.getFilterOptions();
  }
  async searchMicroactivities(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
      }
      const response = await this.microactivityService.searchMicroactivities(searchTerm.trim());
      return this.adaptMicroactivitiesForCatalog(response || []);
    } catch (error) {
      throw this.handleServiceError(error, 'Error en la búsqueda');
    }
  }
  async getMicroactivitiesByCategory(category) {
    try {
      const response = await this.microactivityService.getByCategory(category);
      return this.adaptMicroactivitiesForCatalog(response || []);
    } catch (error) {
      throw this.handleServiceError(error, 'Error al filtrar por categoría');
    }
  }
  adaptMicroactivitiesForCatalog(microactivities) {
    if (!Array.isArray(microactivities)) {
      return [];
    }
    return microactivities.map(item => this.adaptSingleMicroactivity(item));
  }
  adaptMicroactivityForDetail(microactivity) {
    if (!microactivity) {
      throw new Error('Microactividad no encontrada');
    }
    return {
      ...this.adaptSingleMicroactivity(microactivity),
      steps: microactivity.steps || [],
      description: microactivity.description || '',
      concentrationTime: microactivity.concentration_time || 0
    };
  }
  adaptSingleMicroactivity(item) {
    return {
      id: item.id,
      title: item.title || 'Sin título',
      category: item.category || 'Sin categoría',
      duration: item.duration || 0,
      durationInMinutes: item.duration || 0, // Ya viene en minutos desde el backend
      imageUrl: item.image_url,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      categoryIcon: this.getCategoryIcon(item.category),
      durationLabel: this.getDurationLabel(item.duration)
    };
  }
  getCategoryIcon(category) {
    const icons = {
      'Mente': '🧠',
      'Creatividad': '🎨',
      'Cuerpo': '💪',
      default: '⚡'
    };
    return icons[category] || icons.default;
  }
  getDurationLabel(durationInMinutes) {
    const minutes = Math.floor(durationInMinutes || 0);
    if (minutes === 0) {
      return 'Menos de 1 min';
    } else if (minutes === 1) {
      return '1 min';
    } else {
      return `${minutes} min`;
    }
  }
  handleServiceError(error, defaultMessage) {
    const message = error.message || defaultMessage;
    console.error('CatalogService Error:', message, error);
    return new Error(message);
  }
  validateFilters(filters) {
    const validFilters = {};
    if (filters.category && typeof filters.category === 'string') {
      validFilters.category = filters.category;
    }
    if (filters.duration && typeof filters.duration === 'string') {
      validFilters.duration = filters.duration;
    }
    if (filters.nameOrder && ['asc', 'desc', 'none'].includes(filters.nameOrder)) {
      validFilters.nameOrder = filters.nameOrder;
    }
    return validFilters;
  }
}
export const catalogService = new CatalogService();
export default CatalogService;
