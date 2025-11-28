import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { catalogService } from 'core/services/CatalogService';
export const CATALOG_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_MICROACTIVITIES: 'SET_MICROACTIVITIES',
  SET_FILTERED_MICROACTIVITIES: 'SET_FILTERED_MICROACTIVITIES',
  SET_FILTERS: 'SET_FILTERS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_SELECTED_MICROACTIVITY: 'SET_SELECTED_MICROACTIVITY',
  RESET_CATALOG: 'RESET_CATALOG'
};
const initialState = {
  microactivities: [],
  filteredMicroactivities: [],
  selectedMicroactivity: null,
  filters: {
    category: 'all',
    duration: 'all',
    nameOrder: 'none',
    searchTerm: ''
  },
  filterOptions: {
    categories: [],
    durations: [],
    orders: []
  },
  loading: false,
  error: null
};
function catalogReducer(state, action) {
  switch (action.type) {
    case CATALOG_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };
    case CATALOG_ACTIONS.SET_MICROACTIVITIES:
      return {
        ...state,
        microactivities: action.payload,
        filteredMicroactivities: action.payload,
        loading: false,
        error: null
      };
    case CATALOG_ACTIONS.SET_FILTERED_MICROACTIVITIES:
      return {
        ...state,
        filteredMicroactivities: action.payload
      };
    case CATALOG_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    case CATALOG_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case CATALOG_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case CATALOG_ACTIONS.SET_SELECTED_MICROACTIVITY:
      return {
        ...state,
        selectedMicroactivity: action.payload
      };
    case CATALOG_ACTIONS.RESET_CATALOG:
      return {
        ...initialState,
        filterOptions: state.filterOptions
      };
    default:
      return state;
  }
}
const CatalogContext = createContext(undefined);
export function CatalogProvider({ children }) {
  const [state, dispatch] = useReducer(catalogReducer, initialState);
  const loadMicroactivities = useCallback(async () => {
    dispatch({ type: CATALOG_ACTIONS.SET_LOADING, payload: true });
    try {
      const microactivities = await catalogService.getAllMicroactivities();
      dispatch({ 
        type: CATALOG_ACTIONS.SET_MICROACTIVITIES, 
        payload: microactivities 
      });
      const filterOptions = catalogService.getFilterOptions();
      dispatch({ 
        type: CATALOG_ACTIONS.SET_FILTERS, 
        payload: { filterOptions } 
      });
    } catch (error) {
      dispatch({ 
        type: CATALOG_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
    }
  }, []);
  const applyFilters = useCallback((filters) => {
    try {
      const validatedFilters = catalogService.validateFilters(filters);
      dispatch({ 
        type: CATALOG_ACTIONS.SET_FILTERS, 
        payload: validatedFilters 
      });
      const filtered = catalogService.applyFilters(state.microactivities, {
        ...state.filters,
        ...validatedFilters
      });
      dispatch({ 
        type: CATALOG_ACTIONS.SET_FILTERED_MICROACTIVITIES, 
        payload: filtered 
      });
    } catch (error) {
      console.error('Error aplicando filtros:', error);
      dispatch({ 
        type: CATALOG_ACTIONS.SET_ERROR, 
        payload: 'Error al aplicar filtros' 
      });
    }
  }, [state.microactivities, state.filters]);
  const loadMicroactivityById = useCallback(async (id) => {
    dispatch({ type: CATALOG_ACTIONS.SET_LOADING, payload: true });
    try {
      const microactivity = await catalogService.getMicroactivityById(id);
      dispatch({ 
        type: CATALOG_ACTIONS.SET_SELECTED_MICROACTIVITY, 
        payload: microactivity 
      });
    } catch (error) {
      dispatch({ 
        type: CATALOG_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
    } finally {
      dispatch({ type: CATALOG_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);
  const searchMicroactivities = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      const filtered = catalogService.applyFilters(state.microactivities, state.filters);
      dispatch({ 
        type: CATALOG_ACTIONS.SET_FILTERED_MICROACTIVITIES, 
        payload: filtered 
      });
      return;
    }
    dispatch({ type: CATALOG_ACTIONS.SET_LOADING, payload: true });
    try {
      const results = await catalogService.searchMicroactivities(searchTerm);
      const filtered = catalogService.applyFilters(results, state.filters);
      dispatch({ 
        type: CATALOG_ACTIONS.SET_FILTERED_MICROACTIVITIES, 
        payload: filtered 
      });
      dispatch({ 
        type: CATALOG_ACTIONS.SET_FILTERS, 
        payload: { searchTerm } 
      });
    } catch (error) {
      dispatch({ 
        type: CATALOG_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
    } finally {
      dispatch({ type: CATALOG_ACTIONS.SET_LOADING, payload: false });
    }
  }, [state.microactivities, state.filters]);
  const clearError = useCallback(() => {
    dispatch({ type: CATALOG_ACTIONS.CLEAR_ERROR });
  }, []);
  const resetCatalog = useCallback(() => {
    dispatch({ type: CATALOG_ACTIONS.RESET_CATALOG });
  }, []);
  const getFilterOptions = useCallback(() => {
    return catalogService.getFilterOptions();
  }, []);
  const contextValue = {
    ...state,
    loadMicroactivities,
    loadMicroactivityById,
    applyFilters,
    searchMicroactivities,
    clearError,
    resetCatalog,
    getFilterOptions
  };
  return (
    <CatalogContext.Provider value={contextValue}>
      {children}
    </CatalogContext.Provider>
  );
}
export function useCatalogContext() {
  const context = useContext(CatalogContext);
  if (context === undefined) {
    throw new Error('useCatalogContext debe ser usado dentro de CatalogProvider');
  }
  return context;
}
export default CatalogContext;
