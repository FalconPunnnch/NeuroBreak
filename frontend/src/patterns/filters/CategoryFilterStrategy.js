import FilterStrategy from './FilterStrategy.js';
import { CATEGORIES } from 'config/constants';
export class CategoryFilterStrategy extends FilterStrategy {
  apply(items, category) {
    if (!this.isValidCriteria(category) || category === 'all') {
      return items;
    }
    if (!this.isValidCategory(category)) {
      console.warn(`Categoría no válida: ${category}`);
      return items;
    }
    return items.filter(item => 
      item.category && 
      item.category.toLowerCase() === category.toLowerCase()
    );
  }
  isValidCategory(category) {
    return Object.values(CATEGORIES).includes(category);
  }
  getName() {
    return 'category';
  }
  getAvailableCategories() {
    return [
      { value: 'all', label: 'Todas las categorías' },
      ...Object.entries(CATEGORIES).map(([key, value]) => ({
        value: value,
        label: value
      }))
    ];
  }
}
export default CategoryFilterStrategy;
