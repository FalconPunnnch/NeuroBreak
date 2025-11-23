import CategoryFilterStrategy from './CategoryFilterStrategy.js';
import DurationFilterStrategy from './DurationFilterStrategy.js';
import NameOrderStrategy from './NameOrderStrategy.js';
export class FilterFactory {
  constructor() {
    this.strategies = new Map([
      ['category', new CategoryFilterStrategy()],
      ['duration', new DurationFilterStrategy()],
      ['nameOrder', new NameOrderStrategy()]
    ]);
  }
  getStrategy(strategyName) {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) {
      throw new Error(`Estrategia de filtro '${strategyName}' no encontrada`);
    }
    return strategy;
  }
  registerStrategy(name, strategy) {
    if (!strategy || typeof strategy.apply !== 'function') {
      throw new Error('La estrategia debe implementar el método apply()');
    }
    this.strategies.set(name, strategy);
  }
  getAvailableStrategies() {
    return Array.from(this.strategies.keys());
  }
  applyMultipleFilters(items, filters = {}) {
    let result = [...items]; // Copia para evitar mutación
    const filterOrder = ['category', 'duration', 'nameOrder'];
    for (const filterName of filterOrder) {
      const filterValue = filters[filterName];
      if (filterValue !== undefined && filterValue !== null) {
        try {
          const strategy = this.getStrategy(filterName);
          result = strategy.apply(result, filterValue);
        } catch (error) {
          console.warn(`Error aplicando filtro '${filterName}':`, error.message);
        }
      }
    }
    return result;
  }
  getFilterOptions() {
    const options = {};
    this.strategies.forEach((strategy, name) => {
      try {
        if (name === 'category' && typeof strategy.getAvailableCategories === 'function') {
          options.categories = strategy.getAvailableCategories();
        }
        if (name === 'duration' && typeof strategy.getAvailableDurations === 'function') {
          options.durations = strategy.getAvailableDurations();
        }
        if (name === 'nameOrder' && typeof strategy.getAvailableOrders === 'function') {
          options.orders = strategy.getAvailableOrders();
        }
      } catch (error) {
        console.warn(`Error obteniendo opciones para '${name}':`, error.message);
      }
    });
    return options;
  }
}
export const filterFactory = new FilterFactory();
export default FilterFactory;
