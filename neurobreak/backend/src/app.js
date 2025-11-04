// App Configuration - COMPLETO con Passport
// backend/src/app.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('./config/passport.config');

const app = express();

// ============================================
// MIDDLEWARES
// ============================================

// CORS - Permitir peticiones desde el frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar Passport
app.use(passport.initialize());

// Logging de requests (opcional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============================================
// IMPORTAR RUTAS
// ============================================

const authRoutes = require('./infrastructure/api/routes/auth.routes');
const userRoutes = require('./infrastructure/api/routes/user.routes');

// ============================================
// RUTAS DE LA API
// ============================================

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({ 
    message: '🧠 NeuroBreak API',
    version: '1.0.0',
    status: 'running'
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// API ROUTES
// ============================================

// Autenticación (login, register, OAuth, etc.)
app.use('/api/auth', authRoutes);

// Usuarios (perfil, foto, etc.)
app.use('/api/users', userRoutes);

// ============================================
// SERVIR ARCHIVOS ESTÁTICOS
// ============================================

// Servir fotos de perfil y otros uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// EXPORTAR APP
// ============================================

module.exports = app;