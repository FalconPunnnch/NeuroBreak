const express = require('express');
const router = express.Router();
const MoodController = require('../controllers/MoodController');
const authMiddleware = require('../middlewares/authMiddleware');
const moodController = new MoodController();
router.post('/', 
  authMiddleware, 
  (req, res, next) => moodController.createMoodEntry(req, res, next)
);
router.get('/', 
  authMiddleware, 
  (req, res, next) => moodController.getUserMoodEntries(req, res, next)
);
router.get('/activity-stats', 
  authMiddleware, 
  async (req, res, next) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }
      const mockStats = {
        activities: [
          {
            id: 1,
            userId: userId,
            microactivityId: 1,
            completedAt: new Date().toISOString(),
            duration: 300,
            moodId: 1
          },
          {
            id: 2,
            userId: userId,
            microactivityId: 2,
            completedAt: new Date(Date.now() - 24*60*60*1000).toISOString(),
            duration: 600,
            moodId: 2
          }
        ],
        stats: {
          totalActivities: 2,
          totalTime: 900,
          uniqueActivities: 2,
          activeDays: 2
        },
        pagination: {
          page: 1,
          limit: 20,
          hasMore: false
        }
      };
      res.json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: mockStats
      });
    } catch (error) {
      console.error('Error in activity-stats endpoint:', error);
      next(error);
    }
  }
);
router.get('/stats', 
  authMiddleware, 
  (req, res, next) => moodController.getMoodStats(req, res, next)
);
router.delete('/:id', 
  authMiddleware, 
  (req, res, next) => moodController.deleteMoodEntry(req, res, next)
);
module.exports = router;
