import { useState, useEffect, useCallback, useRef } from 'react';
import { useTimer } from '../store/TimerContext';
import microactivityTimerService from '../services/microactivityTimerService';
export default function useRandomSelector() {
  const {
    recentIds,
    avoidN,
    duration,
    setNextMicroactivity,
    addToRecent
  } = useTimer();
  const setNextMicroactivityRef = useRef(setNextMicroactivity);
  useEffect(() => {
    setNextMicroactivityRef.current = setNextMicroactivity;
  }, [setNextMicroactivity]);
  const [allMicroactivities, setAllMicroactivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadMicroactivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const microactivities = await microactivityTimerService.getAllForTimer();
      setAllMicroactivities(microactivities);
    } catch (err) {
      console.error('Error cargando microactividades:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  const selectRandomMicroactivity = useCallback((options = {}) => {
    const {
      maxDuration = null,
      category = null,
      excludeIds = [],
      forceNew = false
    } = options;
    try {
      let availableActivities = [...allMicroactivities];
      if (maxDuration !== null) {
        const maxDurationMinutes = Math.floor(maxDuration / 60);
        availableActivities = availableActivities.filter(
          activity => microactivityTimerService.isCompatibleWithTimer(
            activity, 
            maxDurationMinutes
          )
        );
      }
      if (category) {
        availableActivities = availableActivities.filter(
          activity => activity.category.toLowerCase() === category.toLowerCase()
        );
      }
      if (excludeIds.length > 0) {
        availableActivities = availableActivities.filter(
          activity => !excludeIds.includes(activity.id)
        );
      }
      let candidateActivities = availableActivities.filter(
        activity => !recentIds.includes(activity.id)
      );
      if (candidateActivities.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('No hay actividades nuevas disponibles, usando fallback');
        }
        if (availableActivities.length > 0) {
          candidateActivities = availableActivities;
        } else {
          candidateActivities = allMicroactivities.filter(
            activity => !excludeIds.includes(activity.id)
          );
        }
      }
      if (candidateActivities.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('No hay microactividades disponibles para seleccionar');
        }
        return null; // Retornar null en lugar de lanzar error
      }
      const selectedActivity = _selectWithWeighting(candidateActivities, recentIds);
      return selectedActivity;
    } catch (err) {
      console.error('Error en selección aleatoria:', err);
      throw err;
    }
  }, [allMicroactivities, recentIds]);
  const selectNext = useCallback(async (options = {}) => {
    try {
      if (allMicroactivities.length === 0) {
        await loadMicroactivities();
      }
      const selected = selectRandomMicroactivity({
        maxDuration: duration,
        ...options
      });
      if (selected) {
        setNextMicroactivityRef.current(selected);
        return selected;
      }
      if (process.env.NODE_ENV === 'development') {
        console.info('No hay microactividades disponibles en este momento');
      }
      setNextMicroactivityRef.current(null);
      return null;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [allMicroactivities, duration, selectRandomMicroactivity]); // Removido setNextMicroactivity para evitar loop infinito
  const confirmSelection = useCallback((activityId) => {
    addToRecent(activityId);
  }, [addToRecent]);
  const getSelectionStats = useCallback(() => {
    const total = allMicroactivities.length;
    const available = allMicroactivities.filter(
      activity => !recentIds.includes(activity.id)
    ).length;
    return {
      total,
      available,
      recent: recentIds.length,
      avoidN,
      utilizationRate: total > 0 ? (total - available) / total : 0
    };
  }, [allMicroactivities, recentIds, avoidN]);
  const isActivityAvailable = useCallback((activityId) => {
    return !recentIds.includes(activityId) && 
           allMicroactivities.some(activity => activity.id === activityId);
  }, [recentIds, allMicroactivities]);
  const getActivitiesByCategory = useCallback(() => {
    const categories = {};
    allMicroactivities.forEach(activity => {
      if (!categories[activity.category]) {
        categories[activity.category] = [];
      }
      categories[activity.category].push(activity);
    });
    return categories;
  }, [allMicroactivities]);
  useEffect(() => {
    loadMicroactivities();
  }, [loadMicroactivities]);
  return {
    loading,
    error,
    allMicroactivities,
    selectNext,
    confirmSelection,
    loadMicroactivities,
    selectRandomMicroactivity,
    getSelectionStats,
    isActivityAvailable,
    getActivitiesByCategory,
    stats: getSelectionStats(),
    categorizedActivities: getActivitiesByCategory()
  };
}
function _selectWithWeighting(candidates, recentIds) {
  if (candidates.length === 1) {
    return candidates[0];
  }
  const weights = candidates.map(activity => {
    const recentIndex = recentIds.indexOf(activity.id);
    if (recentIndex === -1) {
      return 10; // Peso máximo para actividades no recientes
    }
    return Math.max(1, 10 - recentIndex);
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let randomValue = Math.random() * totalWeight;
  for (let i = 0; i < candidates.length; i++) {
    randomValue -= weights[i];
    if (randomValue <= 0) {
      return candidates[i];
    }
  }
  return candidates[candidates.length - 1];
}
