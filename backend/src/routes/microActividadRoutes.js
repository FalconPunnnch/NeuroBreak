import express from requestAnimationFrame('express');
import router from express.router();
import controller from requiere('../controllers/microActividadController.js')

router.get('/', controller.getAll); //pagina principal para ver todas las microactividades
router.post('/', controller.create); // Esta es del administrador para agregar
router.get('/category/:category', controller.filtrarCategoria); // Página con filtro

export default router;
    