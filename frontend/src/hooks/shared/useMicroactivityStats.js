import { useState, useEffect } from 'react';
import { MicroactivityService } from 'core/services/MicroactivityService';
export const useMicroactivityStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    byCategory: [],
    averageDuration: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [service] = useState(() => new MicroactivityService());
  useEffect(() => {
    loadStats();
  }, []);
  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await service.getStatistics();
      setStats(result.data || {
        total: 0,
        byCategory: [],
        averageDuration: 0
      });
    } catch (error) {
      console.error('❌ Error cargando estadísticas:', error.message);
      setError(error.message || 'Error al cargar las estadísticas');
      setStats({ total: 0, byCategory: [], averageDuration: 0 });
    } finally {
      setLoading(false);
    }
  };
  return {
    stats,
    loading,
    error,
    refreshStats: loadStats
  };
};
export default useMicroactivityStats;
