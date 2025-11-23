require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
const { runSQLMigrations } = require('./infrastructure/database/sqlMigrationRunner');
const PORT = process.env.PORT || 3001;
async function initializeDatabase() {
  try {
    logger.info('?? Inicializando base de datos...');
    await runSQLMigrations();
    logger.info('? Base de datos inicializada correctamente');
    return true;
  } catch (error) {
    logger.error('? Error inicializando base de datos:', error.message);
    if (process.env.NODE_ENV === 'development') {
      logger.warn('??  Continuando en modo desarrollo sin base de datos');
      return false;
    }
    throw error;
  }
}
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log('================================================');
      console.log(`?? Servidor corriendo en http://localhost:${PORT}`);
      console.log(`?? Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log('================================================');
      console.log('');
      console.log('?? Rutas disponibles:');
      console.log(`   GET  http://localhost:${PORT}/`);
      console.log(`   GET  http://localhost:${PORT}/health`);
      console.log(`   POST http://localhost:${PORT}/api/auth/register`);
      console.log(`   POST http://localhost:${PORT}/api/auth/login`);
      console.log(`   POST http://localhost:${PORT}/api/auth/forgot-password`);
      console.log(`   POST http://localhost:${PORT}/api/auth/reset-password`);
      console.log(`   GET  http://localhost:${PORT}/api/auth/me`);
      console.log(`   POST http://localhost:${PORT}/api/users/profile-picture`);
      console.log('');
      console.log('   ?? Microactividades:');
      console.log(`   GET  http://localhost:${PORT}/api/microactivities`);
      console.log(`   GET  http://localhost:${PORT}/api/microactivities/:id`);
      console.log(`   POST http://localhost:${PORT}/api/microactivities (admin)`);
      console.log(`   PUT  http://localhost:${PORT}/api/microactivities/:id (admin)`);
      console.log(`   DELETE http://localhost:${PORT}/api/microactivities/:id (admin)`);
      console.log('');
      console.log('   ?? Estados emocionales:');
      console.log(`   POST http://localhost:${PORT}/api/moods`);
      console.log(`   GET  http://localhost:${PORT}/api/moods`);
      console.log(`   GET  http://localhost:${PORT}/api/moods/stats`);
      console.log(`   DELETE http://localhost:${PORT}/api/moods/:id`);
      console.log('');
      console.log('?? Archivos estáticos:');
      console.log(`   http://localhost:${PORT}/uploads/...`);
      console.log('================================================');
    });
  } catch (error) {
    logger.error('?? Error fatal al iniciar servidor:', error.message);
    process.exit(1);
  }
}
startServer();
process.on('unhandledRejection', (err) => {
  console.error('? UNHANDLED REJECTION! Apagando...');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('? UNCAUGHT EXCEPTION! Apagando...');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});
process.on('SIGTERM', () => {
  console.log('?? SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('?? SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});
