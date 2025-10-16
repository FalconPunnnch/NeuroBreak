import express from 'express';
import controller from '../controllers/userController.js';

// Inicializamos el router
const router = express.Router();

// Las rutas para registro y login deben ser diferentes
router.post("/register", controller.register); // Ruta para el registro
router.post("/login", controller.login);       // Ruta para el Login

export default router;