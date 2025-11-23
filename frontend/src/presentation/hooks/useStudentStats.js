import { useState, useEffect, useCallback } from 'react';
import StudentDashboardService from '../../core/services/StudentDashboardService';
export const useStudentStats = () => {
  const [stats, setStats] = useState({
    completed: 0,
    totalTime: 0,
    streak: 0,
    weeklyProgress: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardService] = useState(() => new StudentDashboardService());
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [
        statsResult,
        progressResult,
        weeklySummaryResult
      ] = await Promise.all([
        dashboardService.getStudentStats(),
        dashboardService.getProgressMetrics(),
        dashboardService.getWeeklySummary()
      ]);
      setStats({
        completed: statsResult.data?.totalActivities || statsResult.data?.completedToday || 0,
        totalTime: Math.round((statsResult.data?.totalTimeSpent || 0) / 60), // Convertir minutos a horas
        streak: statsResult.data?.currentStreak || progressResult.data?.currentStreak || 0,
        weeklyProgress: calculateWeeklyProgress(statsResult.data, weeklySummaryResult.data),
        general: statsResult.data,
        progress: progressResult.data,
        weekly: weeklySummaryResult.data,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error fetching student stats:', error);
      setError(error.message);
      setStats({
        completed: 0,
        totalTime: 0,
        streak: 0,
        weeklyProgress: 0
      });
    } finally {
      setLoading(false);
    }
  }, [dashboardService]);
  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);
  const calculateWeeklyProgress = (statsData, weeklyData) => {
    const weeklyGoal = 5; // Meta semanal por defecto
    const completedThisWeek = weeklyData?.activities?.length || statsData?.completedToday || 0;
    return Math.min(Math.round((completedThisWeek / weeklyGoal) * 100), 100);
  };
  useEffect(() => {
    fetchStats(); // Habilitar carga de datos del backend
  }, [fetchStats]);
  return {
    stats,
    loading,
    error,
    refreshStats
  };
};
export const useActivityHistory = (initialPage = 1, initialLimit = 10) => {
  const [history, setHistory] = useState({
    activities: [],
    totalCount: 0,
    currentPage: initialPage,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [dashboardService] = useState(() => new StudentDashboardService());
  const fetchHistory = useCallback(async (page = initialPage, limit = initialLimit) => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getActivityHistory(page, limit, filters);
      if (result.success) {
        setHistory(result.data);
      } else {
        setError(result.error);
        setHistory(result.data); // Fallback data
      }
    } catch (error) {
      console.error('Error fetching activity history:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [dashboardService, filters, initialPage, initialLimit]);
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);
  const goToPage = useCallback((page) => {
    fetchHistory(page, history.limit || initialLimit);
  }, [fetchHistory, history.limit, initialLimit]);
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  return {
    history,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    goToPage,
    refreshHistory: () => fetchHistory(history.currentPage)
  };
};
export const useMoodHistory = (initialRange = '7d') => {
  const [moodData, setMoodData] = useState({
    moods: [],
    statistics: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(initialRange);
  const [dashboardService] = useState(() => new StudentDashboardService());
  const fetchMoodHistory = useCallback(async (range = dateRange) => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getMoodHistory(range);
      if (result.success) {
        setMoodData(result.data);
      } else {
        setError(result.error);
        setMoodData(result.data); // Fallback data
      }
    } catch (error) {
      console.error('Error fetching mood history:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [dashboardService, dateRange]);
  const changeDateRange = useCallback((newRange) => {
    setDateRange(newRange);
    fetchMoodHistory(newRange);
  }, [fetchMoodHistory]);
  useEffect(() => {
    fetchMoodHistory();
  }, [fetchMoodHistory]);
  return {
    moodData,
    loading,
    error,
    dateRange,
    changeDateRange,
    refreshMoodHistory: () => fetchMoodHistory()
  };
};
