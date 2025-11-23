const pool = require('../../infrastructure/database/connection');
class MoodRepository {
  constructor(dbConnection = pool) {
    this.db = dbConnection;
  }
  async create(moodData) {
    const query = `
      INSERT INTO mood_entries (user_id, microactivity_id, mood, emoji)
      VALUES ($1, $2, $3, $4)
      RETURNING 
        id,
        user_id,
        microactivity_id,
        mood,
        emoji,
        timestamp as created_at
    `;
    const values = [
      moodData.userId,
      moodData.microactivityId,
      moodData.mood,
      moodData.emoji
    ];
    try {
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error al crear entrada de estado emocional: ${error.message}`);
    }
  }
  async findByUser(filters) {
    let query = `
      SELECT 
        me.id,
        me.user_id,
        me.microactivity_id,
        me.mood,
        me.emoji,
        me.timestamp as created_at,
        m.title as microactivity_name,
        m.category as microactivity_category
      FROM mood_entries me
      LEFT JOIN microactivities m ON me.microactivity_id = m.id
      WHERE me.user_id = $1
    `;
    const values = [filters.userId];
    let paramIndex = 2;
    if (filters.microactivityId) {
      query += ` AND me.microactivity_id = $${paramIndex}`;
      values.push(filters.microactivityId);
      paramIndex++;
    }
    if (filters.startDate) {
      query += ` AND me.timestamp >= $${paramIndex}`;
      values.push(filters.startDate);
      paramIndex++;
    }
    if (filters.endDate) {
      query += ` AND me.timestamp <= $${paramIndex}`;
      values.push(filters.endDate);
      paramIndex++;
    }
    query += ` ORDER BY me.timestamp DESC`;
    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      values.push(filters.limit);
      paramIndex++;
    }
    if (filters.offset) {
      query += ` OFFSET $${paramIndex}`;
      values.push(filters.offset);
      paramIndex++;
    }
    try {
      const result = await this.db.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Error al obtener entradas de estado emocional: ${error.message}`);
    }
  }
  async findByIdAndUser(id, userId) {
    const query = `
      SELECT 
        me.id,
        me.user_id,
        me.microactivity_id,
        me.mood,
        me.emoji,
        me.timestamp as created_at,
        me.updated_at,
        m.name as microactivity_name
      FROM mood_entries me
      LEFT JOIN microactivities m ON me.microactivity_id = m.id
      WHERE me.id = $1 AND me.user_id = $2
    `;
    try {
      const result = await this.db.query(query, [id, userId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error al buscar entrada de estado emocional: ${error.message}`);
    }
  }
  async deleteByIdAndUser(id, userId) {
    const query = `
      DELETE FROM mood_entries 
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;
    try {
      const result = await this.db.query(query, [id, userId]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Error al eliminar entrada de estado emocional: ${error.message}`);
    }
  }
  async getMoodStats(userId, days = 7) {
    const query = `
      SELECT 
        mood,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
      FROM mood_entries
      WHERE user_id = $1 
        AND timestamp >= NOW() - INTERVAL '${days} days'
      GROUP BY mood
      ORDER BY count DESC
    `;
    try {
      const result = await this.db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de estado emocional: ${error.message}`);
    }
  }
  async countByUser(userId, filters = {}) {
    let query = `
      SELECT COUNT(*) as total
      FROM mood_entries
      WHERE user_id = $1
    `;
    const values = [userId];
    let paramIndex = 2;
    if (filters.microactivityId) {
      query += ` AND microactivity_id = $${paramIndex}`;
      values.push(filters.microactivityId);
      paramIndex++;
    }
    if (filters.startDate) {
      query += ` AND timestamp >= $${paramIndex}`;
      values.push(filters.startDate);
      paramIndex++;
    }
    if (filters.endDate) {
      query += ` AND timestamp <= $${paramIndex}`;
      values.push(filters.endDate);
      paramIndex++;
    }
    try {
      const result = await this.db.query(query, values);
      return parseInt(result.rows[0].total);
    } catch (error) {
      throw new Error(`Error al contar entradas de estado emocional: ${error.message}`);
    }
  }
}
module.exports = MoodRepository;
