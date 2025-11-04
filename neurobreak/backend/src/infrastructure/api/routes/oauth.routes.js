// HU03 OAuth - OAuth Routes (Solo Google y Microsoft)
// backend/src/infrastructure/api/routes/oauth.routes.js

const express = require('express');
const router = express.Router();
const passport = require('../../../config/passport.config');
const jwt = require('jsonwebtoken');

// ============================================
// GOOGLE OAUTH
// ============================================

// Iniciar autenticación con Google
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

// Callback de Google
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`
  }),
  (req, res) => {
    try {
      // Generar JWT token
      const token = jwt.sign(
        { 
          userId: req.user.id, 
          email: req.user.email,
          role: req.user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Redirigir al frontend con el token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}&provider=google`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_generation_failed`);
    }
  }
);

// ============================================
// MICROSOFT OAUTH
// ============================================

// Iniciar autenticación con Microsoft
router.get('/microsoft',
  passport.authenticate('microsoft', {
    scope: ['user.read'],
    session: false
  })
);

// Callback de Microsoft
router.get('/microsoft/callback',
  passport.authenticate('microsoft', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=microsoft_auth_failed`
  }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { 
          userId: req.user.id, 
          email: req.user.email,
          role: req.user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}&provider=microsoft`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_generation_failed`);
    }
  }
);

module.exports = router;