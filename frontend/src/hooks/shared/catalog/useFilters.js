import { useState, useCallback, useMemo } from 'react';
import { useCatalogContext } from 'contexts/catalog/CatalogContext';
import { catalogService } from 'core/services/CatalogService';
export function useFilters() {
  const { filters, applyFilters } = useCatalogContext();
  const [localFilters, setLocalFilters] = useState(filters);
  const filterOptions = useMemo(() => {
    return catalogService.getFilterOptions();
  }, []);
  const applyCategory = useCallback((category) => {
    const newFilters = { ...localFilters, category };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
  }, [localFilters, applyFilters]);
  const applyDuration = useCallback((duration) => {
    const newFilters = { ...localFilters, duration };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
  }, [localFilters, applyFilters]);
  const applyOrder = useCallback((nameOrder) => {
    const newFilters = { ...localFilters, nameOrder };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
  }, [localFilters, applyFilters]);
  const applyMultipleFilters = useCallback((newFilters) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    applyFilters(updatedFilters);
  }, [localFilters, applyFilters]);
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      category: 'all',
      duration: 'all',
      nameOrder: 'none',
      searchTerm: ''
    };
    setLocalFilters(clearedFilters);
    applyFilters(clearedFilters);
  }, [applyFilters]);
  const hasActiveFilters = useMemo(() => {
    return (
      localFilters.category !== 'all' ||
      localFilters.duration !== 'all' ||
      localFilters.nameOrder !== 'none' ||
      (localFilters.searchTerm && localFilters.searchTerm.length > 0)
    );
  }, [localFilters]);
  const getActiveFiltersDescription = useCallback(() => {
    const descriptions = [];
    if (localFilters.category !== 'all') {
      descriptions.push(`Categoría: ${localFilters.category}`);
    }
    if (localFilters.duration !== 'all') {
      const durationOption = filterOptions.durations?.find(d => d.value === localFilters.duration);
      descriptions.push(`Duración: ${durationOption?.label || localFilters.duration}`);
    }
    if (localFilters.nameOrder !== 'none') {
      const orderOption = filterOptions.orders?.find(o => o.value === localFilters.nameOrder);
      descriptions.push(`Orden: ${orderOption?.label || localFilters.nameOrder}`);
    }
    if (localFilters.searchTerm) {
      descriptions.push(`Búsqueda: "${localFilters.searchTerm}"`);
    }
    return descriptions.join(', ');
  }, [localFilters, filterOptions]);
  const validateFilter = useCallback((filterType, value) => {
    switch (filterType) {
      case 'category':
        return filterOptions.categories?.some(cat => cat.value === value) || value === 'all';
      case 'duration':
        return filterOptions.durations?.some(dur => dur.value === value) || value === 'all';
      case 'nameOrder':
        return filterOptions.orders?.some(order => order.value === value) || value === 'none';
      default:
        return true;
    }
  }, [filterOptions]);
  return {
    filters: localFilters,
    filterOptions,
    hasActiveFilters,
    activeFiltersDescription: getActiveFiltersDescription(),
    applyCategory,
    applyDuration,
    applyOrder,
    applyMultipleFilters,
    clearFilters,
    validateFilter
  };
}
export default useFilters;
