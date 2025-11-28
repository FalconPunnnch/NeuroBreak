const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('./config/passport.config');
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
const authRoutes = require('./api/routes/auth.routes');
const userRoutes = require('./api/routes/user.routes');
const microactivityRoutes = require('./api/routes/microactivity.routes');
const activityHistoryRoutes = require('./api/routes/activityHistoryRoutes');
const moodRoutes = require('./api/routes/moodRoutes');
app.get('/', (req, res) => {
  res.json({ 
    message: '?? NeuroBreak API',
    version: '1.0.0',
    status: 'running'
  });
});
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/microactivities', microactivityRoutes);
app.use('/api/activity-history', activityHistoryRoutes);
app.use('/api/moods', moodRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Ruta no encontrada',
    path: req.path
  });
});
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
module.exports = app;
