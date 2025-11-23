const database = require('../../config/database.config');
const logger = require('../../utils/logger');
class UserRepository {
  async findByEmail(email) {
    try {
      const result = await database.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error al buscar usuario por email:', error);
      throw error;
    }
  }
  async findById(id) {
    try {
      const result = await database.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error al buscar usuario por ID:', error);
      throw error;
    }
  }
  async create(userData) {
    try {
      const result = await database.query(
        'INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [
          userData.firstName,
          userData.lastName,
          userData.email,
          userData.password,
          userData.phone || null,
          userData.role || 'student'
        ]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error al crear usuario:', error);
      throw error;
    }
  }
  async update(id, userData) {
    try {
      const result = await database.query(
        'UPDATE users SET first_name = $1, last_name = $2, phone = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
        [userData.firstName, userData.lastName, userData.phone, id]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error al actualizar usuario:', error);
      throw error;
    }
  }
  async delete(id) {
    try {
      await database.query('DELETE FROM users WHERE id = $1', [id]);
    } catch (error) {
      logger.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}
module.exports = UserRepository;
