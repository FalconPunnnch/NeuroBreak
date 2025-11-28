const MoodService = require('../../services/MoodService');
const { validateCreateMoodEntry } = require('../validators/moodValidator');
class MoodController {
  constructor(moodService = new MoodService()) {
    this.moodService = moodService;
  }
  async createMoodEntry(req, res, next) {
    try {
      const validationResult = validateCreateMoodEntry(req.body);
      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: validationResult.errors
        });
      }
      const moodData = {
        userId: req.userId, // From authentication middleware
        microactivityId: req.body.microactivityId,
        mood: req.body.mood,
        emoji: req.body.emoji
      };
      const moodEntry = await this.moodService.createMoodEntry(moodData);
      res.status(201).json({
        success: true,
        message: 'Estado emocional registrado exitosamente',
        data: moodEntry
      });
    } catch (error) {
      next(error);
    }
  }
  async getUserMoodEntries(req, res, next) {
    try {
      const userId = req.userId;
      const { limit = 10, offset = 0, microactivityId } = req.query;
      const filters = {
        userId,
        limit: parseInt(limit),
        offset: parseInt(offset),
        ...(microactivityId && { microactivityId: parseInt(microactivityId) })
      };
      try {
        const moodEntries = await this.moodService.getMoodEntriesByUser(filters);
        res.json({
          success: true,
          data: moodEntries
        });
      } catch (dbError) {
        console.log('Tabla moods no existe, devolviendo datos vacíos');
        res.json({
          success: true,
          data: {
            entries: [],
            pagination: {
              total: 0,
              totalPages: 0,
              currentPage: 1,
              limit: parseInt(limit),
              offset: parseInt(offset),
              hasNextPage: false,
              hasPrevPage: false
            }
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async getMoodStats(req, res, next) {
    try {
      const userId = req.userId;
      const { days = 7 } = req.query;
      const stats = await this.moodService.getMoodStats(userId, parseInt(days));
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteMoodEntry(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      await this.moodService.deleteMoodEntry(parseInt(id), userId);
      res.json({
        success: true,
        message: 'Entrada de estado emocional eliminada'
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = MoodController;
