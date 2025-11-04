// Auth Routes COMPLETO - Con OAuth usando Passport
// backend/src/infrastructure/api/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const passport = require('../../../config/passport.config');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

// ============================================
// RUTAS DE AUTENTICACIÓN ESTÁNDAR
// ============================================

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', (req, res) => {
  AuthController.register(req, res);
});

// POST /api/auth/login - Iniciar sesión
router.post('/login', (req, res) => {
  AuthController.login(req, res);
});

// GET /api/auth/me - Obtener usuario actual (requiere autenticación)
router.get('/me', authMiddleware, (req, res) => {
  AuthController.getCurrentUser(req, res);
});

// POST /api/auth/forgot-password - Solicitar recuperación de contraseña
router.post('/forgot-password', (req, res) => {
  AuthController.forgotPassword(req, res);
});

// POST /api/auth/reset-password - Restablecer contraseña con token
router.post('/reset-password', (req, res) => {
  AuthController.resetPassword(req, res);
});

// ============================================
// RUTAS DE OAUTH - Google
// ============================================

// GET /api/auth/google - Iniciar autenticación con Google
router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// GET /api/auth/google/callback - Callback de Google OAuth
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`,
    session: false 
  }),
  (req, res) => {
    AuthController.googleCallback(req, res);
  }
);

// ============================================
// RUTAS DE OAUTH - Microsoft
// ============================================

// GET /api/auth/microsoft - Iniciar autenticación con Microsoft
router.get(
  '/microsoft',
  passport.authenticate('microsoft', {
    scope: ['user.read']
  })
);

// GET /api/auth/microsoft/callback - Callback de Microsoft OAuth
router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=microsoft_auth_failed`,
    session: false
  }),
  (req, res) => {
    AuthController.microsoftCallback(req, res);
  }
);

module.exports = router;