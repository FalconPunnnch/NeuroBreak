const logger = require('../../../utils/logger');
const MicroactivityService = require('../../../core/application/services/MicroactivityService');
const MicroactivityRepository = require('../../../domain/repositories/MicroactivityRepository');
class MicroactivityController {
  constructor(service = null) {
    if (service) {
      this.service = service;
    } else {
      const db = require('../../../infrastructure/database/connection');
      const repository = new MicroactivityRepository(db);
      this.service = new MicroactivityService(repository);
    }
  }
  async getAllMicroactivities(req, res) {
    try {
      const result = await this.service.getAllMicroactivities(req.query);
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      this.handleError(res, error, 'Error al obtener microactividades');
    }
  }
  async getMicroactivityById(req, res) {
    try {
      const { id } = req.params;
      const result = await this.service.getMicroactivityById(id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Microactividad no encontrada'
        });
      }
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      this.handleError(res, error, 'Error al obtener microactividad');
    }
  }
  async createMicroactivity(req, res) {
    try {
      const result = await this.service.createMicroactivity(req.body, req.userId);
      res.status(201).json({
        success: true,
        message: 'Microactividad creada exitosamente',
        data: result
      });
    } catch (error) {
      this.handleError(res, error, 'Error al crear microactividad');
    }
  }
  async updateMicroactivity(req, res) {
    try {
      const { id } = req.params;
      const result = await this.service.updateMicroactivity(id, req.body, req.userId);
      res.json({
        success: true,
        message: 'Microactividad actualizada exitosamente',
        data: result
      });
    } catch (error) {
      this.handleError(res, error, 'Error al actualizar microactividad');
    }
  }
  async deleteMicroactivity(req, res) {
    try {
      const { id } = req.params;
      await this.service.deleteMicroactivity(id, req.userId);
      res.json({
        success: true,
        message: 'Microactividad eliminada exitosamente'
      });
    } catch (error) {
      this.handleError(res, error, 'Error al eliminar microactividad');
    }
  }
  async searchMicroactivities(req, res) {
    try {
      const { q } = req.query;
      const result = await this.service.searchMicroactivities(q);
      res.json({
        success: true,
        data: result,
        count: result.length
      });
    } catch (error) {
      this.handleError(res, error, 'Error en búsqueda de microactividades');
    }
  }
  async getMicroactivityStats(req, res) {
    try {
      const result = await this.service.getStatistics();
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      this.handleError(res, error, 'Error al obtener estadísticas');
    }
  }
  handleError(res, error, defaultMessage) {
    logger.error(defaultMessage, error);
    const statusCode = error.status || 500;
    const message = error.message || defaultMessage;
    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}
module.exports = new MicroactivityController();
