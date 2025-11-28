const express = require('express');
const ActivityHistoryController = require('../controllers/ActivityHistoryController');
const { body, param, query } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const controller = new ActivityHistoryController();
const validateCreateHistory = [
  body('microactivityId')
    .isInt({ min: 1 })
    .withMessage('ID de microactividad debe ser un número entero positivo'),
  body('duration')
    .isInt({ min: 0 })
    .withMessage('Duración debe ser un número entero no negativo'),
  body('moodId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de estado de ánimo debe ser un número entero positivo')
];
const validateGetHistory = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página debe ser un número entero positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe estar entre 1 y 100'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de inicio debe ser una fecha válida (ISO 8601)'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de fin debe ser una fecha válida (ISO 8601)')
];
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID debe ser un número entero positivo')
];
const validateMicroactivityId = [
  param('microactivityId')
    .isInt({ min: 1 })
    .withMessage('ID de microactividad debe ser un número entero positivo')
];
router.post('/', 
  authMiddleware,
  validateCreateHistory, 
  controller.create.bind(controller)
);
router.get('/', 
  authMiddleware, 
  validateGetHistory, 
  controller.getUserHistory.bind(controller)
);
router.get('/stats', 
  authMiddleware,
  controller.getStatistics.bind(controller)
);
router.get('/check/:microactivityId', 
  authMiddleware,
  validateMicroactivityId, 
  controller.checkCompletion.bind(controller)
);
router.get('/:id', 
  authMiddleware,
  validateId, 
  controller.getById.bind(controller)
);
module.exports = router;
