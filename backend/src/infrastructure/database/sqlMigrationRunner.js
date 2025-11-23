require('dotenv').config();
const fs = require('fs');
const path = require('path');
const database = require('../../config/database.config');
const logger = require('../../utils/logger');
class SQLMigrationRunner {
  constructor() {
    this.migrationsDir = path.join(__dirname, 'migrations');
    this.database = database;
  }
  async runMigrations() {
    logger.info('🚀 Iniciando migraciones de base de datos...');
    const client = await this.database.getClient();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
      logger.info('✅ Tabla de control de migraciones lista');
      const result = await client.query('SELECT name FROM migrations ORDER BY id');
      const executedMigrations = result.rows.map(row => row.name);
      logger.info(`📋 Migraciones ejecutadas previamente: ${executedMigrations.length}`);
      if (!fs.existsSync(this.migrationsDir)) {
        logger.warn('⚠️  Carpeta de migraciones no encontrada. Creándola...');
        fs.mkdirSync(this.migrationsDir, { recursive: true });
        logger.info('✅ Carpeta de migraciones creada');
        return;
      }
      const migrationFiles = fs.readdirSync(this.migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();
      logger.info(`📂 Archivos de migración encontrados: ${migrationFiles.length}`);
      let executedCount = 0;
      for (const file of migrationFiles) {
        const migrationName = file.replace('.sql', '');
        if (executedMigrations.includes(migrationName)) {
          logger.info(`⏭️  Saltando ${migrationName} (ya ejecutada)`);
          continue;
        }
        logger.info(`▶️  Ejecutando ${migrationName}...`);
        try {
          const sqlFilePath = path.join(this.migrationsDir, file);
          logger.info(`📖 Leyendo archivo: ${sqlFilePath}`);
          const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
          if (!sqlContent.trim()) {
            throw new Error('El archivo SQL está vacío');
          }
          logger.info(`📄 Contenido del archivo (primeros 100 caracteres): ${sqlContent.substring(0, 100)}...`);
          const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);
          for (const statement of statements) {
            if (statement.trim()) {
              logger.info(`🔄 Ejecutando: ${statement.substring(0, 50)}...`);
              await client.query(statement);
            }
          }
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [migrationName]
          );
          logger.info(`✅ ${migrationName} ejecutada exitosamente`);
          executedCount++;
        } catch (error) {
          logger.error(`❌ Error ejecutando ${migrationName}:`);
          logger.error(`   Mensaje: ${error.message}`);
          logger.error(`   Código: ${error.code || 'N/A'}`);
          if (error.position) {
            logger.error(`   Posición: ${error.position}`);
          }
          throw error;
        }
      }
      if (executedCount === 0) {
        logger.info('✅ No hay migraciones pendientes');
      } else {
        logger.info(`✅ ${executedCount} migración(es) ejecutada(s) exitosamente`);
      }
    } catch (error) {
      logger.error('❌ Error en el proceso de migración:');
      logger.error(`   Mensaje: ${error.message}`);
      logger.error(`   Código: ${error.code || 'N/A'}`);
      throw error;
    } finally {
      client.release();
    }
  }
  async checkDatabaseConnection() {
    try {
      await this.database.query('SELECT 1');
      logger.info('✅ Conexión a la base de datos establecida');
      return true;
    } catch (error) {
      logger.error('❌ Error conectando a la base de datos:', error.message);
      return false;
    }
  }
  async runWithRetry(maxRetries = 5, delay = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const isConnected = await this.checkDatabaseConnection();
        if (!isConnected) {
          throw new Error('No se pudo establecer conexión con la base de datos');
        }
        await this.runMigrations();
        logger.info('🎉 Migraciones completadas exitosamente');
        return true;
      } catch (error) {
        if (attempt === maxRetries) {
          logger.error(`💥 Error fatal después de ${maxRetries} intentos:`);
          logger.error(`   Mensaje: ${error.message}`);
          logger.error(`   Código: ${error.code || 'N/A'}`);
          throw error;
        }
        logger.warn(`⚠️  Intento ${attempt} fallido, reintentando en ${delay}ms...`);
        logger.warn(`   Error: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}
async function runSQLMigrations() {
  const runner = new SQLMigrationRunner();
  return await runner.runWithRetry();
}
if (require.main === module) {
  runSQLMigrations()
    .then(() => {
      logger.info('🎉 Proceso de migración completado');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Error fatal en migraciones:', error.message);
      process.exit(1);
    });
}
module.exports = { SQLMigrationRunner, runSQLMigrations };
