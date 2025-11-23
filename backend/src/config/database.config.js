const { Pool } = require('pg');
const logger = require('../utils/logger');
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'neurobreak_db',
      user: process.env.DB_USER || 'postgres',
      password: String(process.env.DB_PASSWORD || ''),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    this.pool.on('connect', () => {
      logger.info(' Nueva conexión a PostgreSQL establecida');
    });
    this.pool.on('error', (err) => {
      logger.error(' Error inesperado en cliente de PostgreSQL:', err);
      process.exit(-1);
    });
    Database.instance = this;
  }
  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Query ejecutado', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      logger.error('Error en query de base de datos:', error);
      throw error;
    }
  }
  async getClient() {
    return await this.pool.connect();
  }
  async close() {
    await this.pool.end();
    logger.info(' Pool de conexiones cerrado');
  }
}
const database = new Database();
Object.freeze(database);
module.exports = database;
