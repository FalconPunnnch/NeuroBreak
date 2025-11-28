const pool = require('../infrastructure/database/connection');
class ActivityHistoryRepository {
  async create(historyData) {
    const { userId, microactivityId, duration, moodId = null } = historyData;
    const query = `
      INSERT INTO activity_history (user_id, microactivity_id, duration, mood_id)
      VALUES ($1, $2, $3, $4)
      RETURNING 
        id, 
        user_id as "userId", 
        microactivity_id as "microactivityId", 
        completed_at as "completedAt", 
        duration, 
        mood_id as "moodId"
    `;
    const values = [userId, microactivityId, duration, moodId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  async findByUser(userId, options = {}) {
    const { limit = 50, offset = 0, startDate, endDate } = options;
    let query = `
      SELECT 
        ah.id,
        ah.user_id as "userId",
        ah.microactivity_id as "microactivityId",
        ah.completed_at as "completedAt",
        ah.duration,
        ah.mood_id as "moodId",
        m.title as "microactivityName",
        m.description as "microactivityDescription",
        m.category as "microactivityCategory"
      FROM activity_history ah
      LEFT JOIN microactivities m ON ah.microactivity_id = m.id
      WHERE ah.user_id = $1
    `;
    const values = [userId];
    let paramCounter = 2;
    if (startDate) {
      query += ` AND ah.completed_at >= $${paramCounter}`;
      values.push(startDate);
      paramCounter++;
    }
    if (endDate) {
      query += ` AND ah.completed_at <= $${paramCounter}`;
      values.push(endDate);
      paramCounter++;
    }
    query += ` ORDER BY ah.completed_at DESC LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    values.push(limit, offset);
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error in ActivityHistoryRepository.findByUser:', error);
      return [];
    }
  }
  async findById(id) {
    const query = `
      SELECT 
        ah.id,
        ah.user_id as "userId",
        ah.microactivity_id as "microactivityId",
        ah.completed_at as "completedAt",
        ah.duration,
        ah.mood_id as "moodId"
      FROM activity_history ah
      WHERE ah.id = $1
    `;
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in ActivityHistoryRepository.findById:', error);
      return null;
    }
  }
  async getUserStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as "totalActivities",
        COALESCE(SUM(duration), 0) as "totalTime",
        COUNT(DISTINCT microactivity_id) as "uniqueActivities",
        COUNT(DISTINCT DATE(completed_at)) as "activeDays"
      FROM activity_history
      WHERE user_id = $1
    `;
    try {
      const result = await pool.query(query, [userId]);
      const stats = result.rows[0];
      return {
        totalActivities: parseInt(stats.totalActivities) || 0,
        totalTime: parseInt(stats.totalTime) || 0,
        uniqueActivities: parseInt(stats.uniqueActivities) || 0,
        activeDays: parseInt(stats.activeDays) || 0
      };
    } catch (error) {
      console.error('Error in ActivityHistoryRepository.getUserStats:', error);
      return {
        totalActivities: 0,
        totalTime: 0,
        uniqueActivities: 0,
        activeDays: 0
      };
    }
  }
  async hasCompletedActivity(userId, microactivityId) {
    const query = `
      SELECT COUNT(*) as count
      FROM activity_history
      WHERE user_id = $1 AND microactivity_id = $2
    `;
    try {
      const result = await pool.query(query, [userId, microactivityId]);
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error('Error in ActivityHistoryRepository.hasCompletedActivity:', error);
      return false;
    }
  }
}
module.exports = ActivityHistoryRepository;
