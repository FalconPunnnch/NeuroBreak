import express from requestAnimationFrame('express');
import router from express.router();
import controller from requiere('../controllers/userController.js')

router.post("/", controller.register); //Página de registro
router.post("/",controller.login); //Página de Login

export default router;
