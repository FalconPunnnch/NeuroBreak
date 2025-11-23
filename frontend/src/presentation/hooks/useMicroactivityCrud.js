import { useState, useEffect } from 'react';
import { MicroactivityService } from '../../core/services/MicroactivityService';
export const useMicroactivityCrud = () => {
  const [microactivities, setMicroactivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [service] = useState(() => new MicroactivityService());
  useEffect(() => {
    loadMicroactivities();
  }, []);
  const loadMicroactivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (searchTerm.trim()) filters.search = searchTerm.trim();
      if (selectedCategory) filters.category = selectedCategory;
      const result = await service.getAllMicroactivities(filters);
      setMicroactivities(result.data || []);
    } catch (error) {
      console.error('Error cargando microactividades:', error);
      setError(error.message || 'Error al cargar las microactividades');
    } finally {
      setLoading(false);
    }
  };
  const createMicroactivity = async (data) => {
    try {
      await service.createMicroactivity(data);
      return true;
    } catch (error) {
      console.error('Error creando microactividad:', error);
      throw error;
    }
  };
  const updateMicroactivity = async (id, data) => {
    try {
      await service.updateMicroactivity(id, data);
      return true;
    } catch (error) {
      console.error('Error actualizando microactividad:', error);
      throw error;
    }
  };
  const deleteMicroactivity = async (id) => {
    try {
      await service.deleteMicroactivity(id);
      await loadMicroactivities();
      return true;
    } catch (error) {
      console.error('Error eliminando microactividad:', error);
      return false;
    }
  };
  const searchMicroactivities = async (term) => {
    setSearchTerm(term);
    await loadMicroactivities();
  };
  const filterByCategory = async (category) => {
    setSelectedCategory(category);
    await loadMicroactivities();
  };
  const clearFilters = async () => {
    setSearchTerm('');
    setSelectedCategory('');
    await loadMicroactivities();
  };
  return {
    microactivities,
    loading,
    error,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    loadMicroactivities,
    createMicroactivity,
    updateMicroactivity,
    deleteMicroactivity,
    searchMicroactivities,
    filterByCategory,
    clearFilters
  };
};
