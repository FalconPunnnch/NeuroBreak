import { useState, useCallback, useEffect } from 'react';
import { useCatalogContext } from 'contexts/catalog/CatalogContext';
export function useSearch() {
  const { searchMicroactivities, filters, loading } = useCatalogContext();
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const DEBOUNCE_DELAY = 300; // 300ms de delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  useEffect(() => {
    if (debouncedTerm !== filters.searchTerm) {
      searchMicroactivities(debouncedTerm);
    }
  }, [debouncedTerm, searchMicroactivities, filters.searchTerm]);
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedTerm('');
    searchMicroactivities('');
  }, [searchMicroactivities]);
  const executeSearch = useCallback((term) => {
    const searchValue = term !== undefined ? term : searchTerm;
    setSearchTerm(searchValue);
    setDebouncedTerm(searchValue);
    searchMicroactivities(searchValue);
  }, [searchTerm, searchMicroactivities]);
  const hasActiveSearch = searchTerm.length > 0;
  const isWaitingForDebounce = searchTerm !== debouncedTerm;
  const isValidSearch = searchTerm.length >= 2;
  return {
    searchTerm,
    debouncedTerm,
    hasActiveSearch,
    isWaitingForDebounce,
    isValidSearch,
    isSearching: loading && hasActiveSearch,
    handleSearchChange,
    clearSearch,
    executeSearch,
    minSearchLength: 2,
    debounceDelay: DEBOUNCE_DELAY
  };
}
export default useSearch;
