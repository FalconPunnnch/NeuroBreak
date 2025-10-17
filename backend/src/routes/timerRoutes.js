import express from requestAnimationFrame('express');
import router from express.router();
import controller from requiere('../controllers/timerController.js')


router.post("/timer", controller.Timer); //pagina Timer

export default router;