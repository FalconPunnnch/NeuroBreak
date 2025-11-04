// Server - Entry Point COMPLETO
// backend/src/server.js

require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3001;

// Iniciar servidor
app.listen(PORT, () => {
  console.log('================================================');
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('================================================');
  console.log('');
  console.log('📋 Rutas disponibles:');
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   POST http://localhost:${PORT}/api/auth/forgot-password`);
  console.log(`   POST http://localhost:${PORT}/api/auth/reset-password`);
  console.log(`   GET  http://localhost:${PORT}/api/auth/me`);
  console.log(`   POST http://localhost:${PORT}/api/users/profile-picture`);
  console.log('');
  console.log('📁 Archivos estáticos:');
  console.log(`   http://localhost:${PORT}/uploads/...`);
  console.log('================================================');
});

// ============================================
// MANEJO DE ERRORES NO CAPTURADOS
// ============================================

// Promesas rechazadas no manejadas
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Apagando...');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

// Excepciones no capturadas
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Apagando...');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

// Señal de terminación (Ctrl+C)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});