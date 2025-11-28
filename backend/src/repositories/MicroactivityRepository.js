const pool = require('../infrastructure/database/connection');
class MicroactivityRepository {
  constructor(database = pool) {
    this.db = database;
  }
  async findAll(filters = {}) {
    try {
      // Nota: aumentamos el límite por defecto de 10 a 1000 para que el catálogo
      // reciba todas las microactividades del seed cuando no se indiquen filtros
      // de paginación desde el frontend. Para un sistema en producción conviene
      // implementar paginación real en la UI.
      let query = 'SELECT * FROM microactivities WHERE 1=1';
      const params = [];
      let paramIndex = 1;
      if (filters.category) {
        query += ` AND category = $${paramIndex}`;
        params.push(filters.category);
        paramIndex++;
      }
      if (filters.search) {
        query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
        params.push(`%${filters.search}%`);
        paramIndex++;
      }
      query += ' ORDER BY id ASC';
      const result = await this.db.query(query, params);
      const total = await this.getTotalCount({ category: filters.category, search: filters.search });
      return {
        data: result.rows,
        pagination: {
          total
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener microactividades: ${error.message}`);
    }
  }
  async findById(id) {
    try {
      const result = await this.db.query(
        'SELECT * FROM microactivities WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Error al obtener microactividad por ID: ${error.message}`);
    }
  }
  async create(data) {
    try {
      const {
        title,
        description,
        category,
        duration,
        concentration_time,
        steps,
        image_url,
        createdBy,
        createdAt
      } = data;
      const result = await this.db.query(
        `INSERT INTO microactivities (
          title, description, category, duration, concentration_time,
          steps, image_url, requirements, benefits, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          title,
          description,
          category,
          duration,
          concentration_time || null,
          steps ? JSON.stringify(steps) : null,
          image_url || null,
          data.requirements || null,
          data.benefits || null,
          createdAt
        ]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error al crear microactividad: ${error.message}`);
    }
  }
  async update(id, data) {
    try {
      const {
        title,
        description,
        category,
        duration,
        concentration_time,
        steps,
        image_url,
        requirements,
        benefits
      } = data;
      const result = await this.db.query(
        `UPDATE microactivities SET
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          category = COALESCE($3, category),
          duration = COALESCE($4, duration),
          concentration_time = COALESCE($5, concentration_time),
          steps = COALESCE($6, steps),
          image_url = COALESCE($7, image_url),
          requirements = COALESCE($8, requirements),
          benefits = COALESCE($9, benefits),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *`,
        [
          title,
          description,
          category,
          duration,
          concentration_time,
          steps ? JSON.stringify(steps) : steps,
          image_url,
          requirements,
          benefits,
          id
        ]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error al actualizar microactividad: ${error.message}`);
    }
  }
  async delete(id) {
    try {
      const result = await this.db.query(
        'DELETE FROM microactivities WHERE id = $1 RETURNING id',
        [id]
      );
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Error al eliminar microactividad: ${error.message}`);
    }
  }
  async search(searchTerm) {
    try {
      const result = await this.db.query(
        `SELECT * FROM microactivities 
         WHERE title ILIKE $1 OR description ILIKE $1 
         ORDER BY 
           CASE 
             WHEN title ILIKE $1 THEN 1
             WHEN description ILIKE $1 THEN 2
             ELSE 3
           END, 
           created_at DESC`,
        [`%${searchTerm}%`]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error en búsqueda de microactividades: ${error.message}`);
    }
  }
  async getStatistics() {
    try {
      const [totalResult, categoryResult, avgDurationResult] = await Promise.all([
        this.db.query('SELECT COUNT(*) as total FROM microactivities'),
        this.db.query(`
          SELECT category, COUNT(*) as count 
          FROM microactivities 
          GROUP BY category 
          ORDER BY count DESC
        `),
        this.db.query('SELECT AVG(duration) as avg_duration FROM microactivities')
      ]);
      return {
        total: parseInt(totalResult.rows[0].total),
        byCategory: categoryResult.rows,
        averageDuration: parseFloat(avgDurationResult.rows[0].avg_duration) || 0
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
  async getTotalCount(filters = {}) {
    try {
      const { category, search } = filters;
      let countQuery = 'SELECT COUNT(*) as total FROM microactivities WHERE 1=1';
      const countParams = [];
      let countIndex = 1;
      if (category) {
        countQuery += ` AND category = $${countIndex}`;
        countParams.push(category);
        countIndex++;
      }
      if (search) {
        countQuery += ` AND (title ILIKE $${countIndex} OR description ILIKE $${countIndex})`;
        countParams.push(`%${search}%`);
      }
      const countResult = await this.db.query(countQuery, countParams);
      return parseInt(countResult.rows[0].total);
    } catch (error) {
      throw new Error(`Error al contar microactividades: ${error.message}`);
    }
  }
}
module.exports = MicroactivityRepository;
