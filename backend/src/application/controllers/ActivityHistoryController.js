const ActivityHistoryService = require('../../domain/services/ActivityHistoryService');
const { ValidationError, NotFoundError } = require('../../utils/errors');
class ActivityHistoryController {
  constructor() {
    this.service = new ActivityHistoryService();
  }
  async create(req, res, next) {
    try {
      const { microactivityId, duration, moodId } = req.body;
      const userId = req.userId; // Viene del authMiddleware
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }
      const historyEntry = await this.service.recordCompletedActivity({
        userId,
        microactivityId,
        duration,
        moodId
      });
      res.status(201).json({
        success: true,
        message: 'Actividad registrada exitosamente',
        data: historyEntry
      });
    } catch (error) {
      console.error('Error en ActivityHistoryController.create:', error);
      next(error);
    }
  }
  async getUserHistory(req, res, next) {
    try {
      const userId = req.userId; // Viene del authMiddleware
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }
      const { page, limit, startDate, endDate } = req.query;
      const filters = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
        startDate: startDate || null,
        endDate: endDate || null
      };
      const history = await this.service.getUserHistory(userId, filters);
      res.json({
        success: true,
        message: 'Historial obtenido exitosamente',
        data: history
      });
    } catch (error) {
      console.error('Error in ActivityHistoryController.getUserHistory:', error);
      res.json({
        success: true,
        message: 'No hay historial registrado aún',
        data: {
          activities: [],
          stats: {
            totalActivities: 0,
            totalTime: 0,
            uniqueActivities: 0,
            activeDays: 0
          },
          pagination: {
            page: 1,
            limit: filters.limit,
            hasMore: false
          }
        }
      });
    }
  }
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }
      const entry = await this.service.getHistoryEntry(parseInt(id), userId);
      res.json({
        success: true,
        message: 'Entrada obtenida exitosamente',
        data: entry
      });
    } catch (error) {
      next(error);
    }
  }
  async getStatistics(req, res, next) {
    try {
      const userId = req.userId; // Usar req.userId como en otros métodos
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }
      const stats = await this.service.getUserStatistics(userId);
      res.json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
  async checkCompletion(req, res, next) {
    try {
      const { microactivityId } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }
      const result = await this.service.checkActivityCompletion(
        userId, 
        parseInt(microactivityId)
      );
      res.json({
        success: true,
        message: 'Estado de actividad verificado',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = ActivityHistoryController;
