const pool = require('../../../infrastructure/database/connection');
const bcrypt = require('bcryptjs');
class AuthService {
  async findUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }
  async findUserById(userId) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
  async createUser(userData) {
    const { firstName, lastName, email, password, role, profilePicture } = userData;
    const query = `
      INSERT INTO users (first_name, last_name, email, password, role, profile_picture, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, first_name, last_name, email, role, profile_picture, created_at
    `;
    const values = [firstName, lastName, email, password, role, profilePicture || null];
    const result = await pool.query(query, values);
    return {
      id: result.rows[0].id,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      email: result.rows[0].email,
      role: result.rows[0].role,
      profilePicture: result.rows[0].profile_picture,
      createdAt: result.rows[0].created_at
    };
  }
  async updatePassword(userId, newHashedPassword) {
    const query = `
      UPDATE users 
      SET password = $1, 
          reset_token = NULL, 
          reset_token_expires = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email
    `;
    const result = await pool.query(query, [newHashedPassword, userId]);
    return result.rows[0];
  }
  async savePasswordResetToken(userId, tokenHash, expiryDate) {
    const query = `
      UPDATE users 
      SET reset_token = $1, 
          reset_token_expires = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, email
    `;
    const result = await pool.query(query, [tokenHash, expiryDate, userId]);
    return result.rows[0];
  }
  async findUserByResetToken(tokenHash) {
    const query = `
      SELECT * FROM users 
      WHERE reset_token = $1 
      AND reset_token_expires > NOW()
    `;
    const result = await pool.query(query, [tokenHash]);
    return result.rows[0];
  }
  async emailExists(email) {
    const user = await this.findUserByEmail(email);
    return !!user;
  }
  async updateProfilePicture(userId, profilePicturePath) {
    const query = `
      UPDATE users 
      SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, first_name, last_name, email, role, profile_picture
    `;
    const result = await pool.query(query, [profilePicturePath, userId]);
    return result.rows[0];
  }
  async updateProfile(userId, profileData) {
    const { firstName, lastName, bio } = profileData;
    const query = `
      UPDATE users 
      SET 
        first_name = $1, 
        last_name = $2, 
        bio = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, first_name, last_name, email, role, bio, profile_picture
    `;
    const result = await pool.query(query, [firstName, lastName, bio, userId]);
    return result.rows[0];
  }
  async updateLastLogin(userId) {
    const query = `
      UPDATE users 
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await pool.query(query, [userId]);
  }
  async getAllUsers() {
    const query = `
      SELECT id, first_name, last_name, email, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
  async deleteUser(userId) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}
module.exports = AuthService;
