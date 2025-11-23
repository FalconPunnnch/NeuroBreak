const express = require('express');
const router = express.Router();
const passport = require('../../../config/passport.config');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/register', (req, res) => {
  AuthController.register(req, res);
});
router.post('/login', (req, res) => {
  AuthController.login(req, res);
});
router.get('/me', authMiddleware, (req, res) => {
  AuthController.getCurrentUser(req, res);
});
router.post('/forgot-password', (req, res) => {
  AuthController.forgotPassword(req, res);
});
router.post('/reset-password', (req, res) => {
  AuthController.resetPassword(req, res);
});
router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);
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
router.get(
  '/microsoft',
  passport.authenticate('microsoft', {
    scope: ['user.read']
  })
);
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
