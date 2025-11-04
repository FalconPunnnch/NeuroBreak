// Rutas de autenticación
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// HU02, HU16: Login
router.post('/login', AuthController.login);

// HU03: Registro
router.post('/register', AuthController.register);

// HU04, HU18: Recuperar contraseña
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// OAuth routes
router.post('/google', AuthController.googleAuth);
router.post('/microsoft', AuthController.microsoftAuth);
router.post('/apple', AuthController.appleAuth);

// Logout
router.post('/logout', AuthController.logout);

module.exports = router;
