export class FilterStrategy {
  apply(items, criteria) {
    throw new Error('FilterStrategy.apply() debe ser implementado por las subclases');
  }
  isValidCriteria(criteria) {
    return criteria !== null && criteria !== undefined;
  }
  getName() {
    throw new Error('FilterStrategy.getName() debe ser implementado por las subclases');
  }
}
export default FilterStrategy;
