const express = require('express');
const MicroactivityController = require('../controllers/MicroactivityController');
const authMiddleware = require('../middlewares/authMiddleware');
class MicroactivityRoutes {
  constructor() {
    this.router = express.Router();
    this.controller = MicroactivityController; 
    this.setupRoutes();
  }
  createAdminMiddleware() {
    return (req, res, next) => {
      console.log('👑 AdminMiddleware - Checking admin permissions');
      console.log('👑 AdminMiddleware - User info:', {
        userId: req.userId,
        email: req.userEmail,
        role: req.userRole
      });
      if (!req.userId || !req.userRole) {
        console.log('❌ AdminMiddleware - Missing user info');
        return res.status(401).json({
          success: false,
          message: 'Autenticación requerida'
        });
      }
      const userRole = req.userRole;
      console.log('🔍 AdminMiddleware - User role:', userRole);
      if (userRole !== 'admin' && userRole !== 'administrator') {
        console.log('🚫 AdminMiddleware - Insufficient permissions');
        return res.status(403).json({
          success: false,
          message: 'Permisos de administrador requeridos'
        });
      }
      console.log('✅ AdminMiddleware - Admin access granted');
      next();
    };
  }
  setupRoutes() {
    this.setupPublicRoutes();
    this.setupProtectedRoutes();
  }
  setupPublicRoutes() {
    this.router.get('/', this.asyncHandler(
      this.controller.getAllMicroactivities.bind(this.controller)
    ));
    this.router.get('/search', this.asyncHandler(
      this.controller.searchMicroactivities.bind(this.controller)
    ));
    this.router.get('/stats', this.asyncHandler(
      this.controller.getMicroactivityStats.bind(this.controller)
    ));
    this.router.get('/:id', this.asyncHandler(
      this.controller.getMicroactivityById.bind(this.controller)
    ));
  }
  setupProtectedRoutes() {
    const adminMiddleware = this.createAdminMiddleware();
    this.router.post('/', 
      authMiddleware, 
      adminMiddleware, 
      this.asyncHandler(this.controller.createMicroactivity.bind(this.controller))
    );
    this.router.put('/:id', 
      authMiddleware, 
      adminMiddleware, 
      this.asyncHandler(this.controller.updateMicroactivity.bind(this.controller))
    );
    this.router.delete('/:id', 
      authMiddleware, 
      adminMiddleware, 
      this.asyncHandler(this.controller.deleteMicroactivity.bind(this.controller))
    );
  }
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
  getRouter() {
    return this.router;
  }
}
module.exports = new MicroactivityRoutes().getRouter();
