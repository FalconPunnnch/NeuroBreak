// Router principal - Punto de entrada de todas las rutas
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const microactivityRoutes = require('./microactivityRoutes');
const moodRoutes = require('./moodRoutes');
const historyRoutes = require('./historyRoutes');
const metricsRoutes = require('./metricsRoutes');
const adminRoutes = require('./adminRoutes');

// Rutas públicas
router.use('/auth', authRoutes);

// Rutas protegidas
router.use('/users', userRoutes);
router.use('/microactivities', microactivityRoutes);
router.use('/mood', moodRoutes);
router.use('/history', historyRoutes);
router.use('/metrics', metricsRoutes);

// Rutas de administrador
router.use('/admin', adminRoutes);

module.exports = router;
