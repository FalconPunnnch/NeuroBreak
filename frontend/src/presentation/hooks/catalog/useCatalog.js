import { useEffect, useCallback } from 'react';
import { useCatalogContext } from '../../../state/contexts/catalog/CatalogContext.js';
export function useCatalog() {
  const {
    microactivities,
    filteredMicroactivities,
    selectedMicroactivity,
    filters,
    loading,
    error,
    loadMicroactivities,
    loadMicroactivityById,
    applyFilters,
    searchMicroactivities,
    clearError,
    resetCatalog
  } = useCatalogContext();
  useEffect(() => {
    if (microactivities.length === 0 && !loading) {
      loadMicroactivities();
    }
  }, [microactivities.length, loading, loadMicroactivities]);
  const handleFiltersChange = useCallback((newFilters) => {
    applyFilters(newFilters);
  }, [applyFilters]);
  const handleSearch = useCallback((searchTerm) => {
    searchMicroactivities(searchTerm);
  }, [searchMicroactivities]);
  const getMicroactivityById = useCallback((id) => {
    return loadMicroactivityById(id);
  }, [loadMicroactivityById]);
  const handleReset = useCallback(() => {
    resetCatalog();
  }, [resetCatalog]);
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);
  const reloadCatalog = useCallback(() => {
    resetCatalog();
    loadMicroactivities();
  }, [resetCatalog, loadMicroactivities]);
  return {
    microactivities,
    filteredMicroactivities,
    selectedMicroactivity,
    filters,
    loading,
    error,
    totalItems: microactivities.length,
    filteredCount: filteredMicroactivities.length,
    hasItems: microactivities.length > 0,
    hasFilteredItems: filteredMicroactivities.length > 0,
    applyFilters: handleFiltersChange,
    searchMicroactivities: handleSearch,
    getMicroactivityById,
    clearError: handleClearError,
    resetCatalog: handleReset,
    reloadCatalog
  };
}
export default useCatalog;
