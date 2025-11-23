import FilterStrategy from './FilterStrategy.js';
export class NameOrderStrategy extends FilterStrategy {
  apply(items, order) {
    if (!this.isValidCriteria(order) || order === 'none') {
      return items;
    }
    if (!this.isValidOrder(order)) {
      console.warn(`Orden no válido: ${order}`);
      return items;
    }
    const sortedItems = [...items];
    return sortedItems.sort((a, b) => {
      const titleA = (a.title || '').toLowerCase().trim();
      const titleB = (b.title || '').toLowerCase().trim();
      if (order === 'asc') {
        return titleA.localeCompare(titleB, 'es', { sensitivity: 'base' });
      } else {
        return titleB.localeCompare(titleA, 'es', { sensitivity: 'base' });
      }
    });
  }
  isValidOrder(order) {
    return ['asc', 'desc'].includes(order);
  }
  getName() {
    return 'nameOrder';
  }
  getAvailableOrders() {
    return [
      { value: 'none', label: 'Sin orden específico' },
      { value: 'asc', label: 'A - Z' },
      { value: 'desc', label: 'Z - A' }
    ];
  }
}
export default NameOrderStrategy;
