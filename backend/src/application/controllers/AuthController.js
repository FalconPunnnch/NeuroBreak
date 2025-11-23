const AuthService = require('../../domain/services/AuthService');
const logger = require('../../utils/logger');
class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: result
      });
    } catch (error) {
      logger.error('Error en login:', error);
      next(error);
    }
  }
  async register(req, res, next) {
    try {
      const userData = req.body;
      const result = await AuthService.register(userData);
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error) {
      logger.error('Error en registro:', error);
      next(error);
    }
  }
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      res.json({
        success: true,
        message: 'Se ha enviado un correo con instrucciones'
      });
    } catch (error) {
      logger.error('Error en forgot password:', error);
      next(error);
    }
  }
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      await AuthService.resetPassword(token, newPassword);
      res.json({
        success: true,
        message: 'Contraseña restablecida exitosamente'
      });
    } catch (error) {
      logger.error('Error en reset password:', error);
      next(error);
    }
  }
  async googleAuth(req, res, next) {
    try {
      const { token } = req.body;
      const result = await AuthService.googleAuth(token);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error en Google auth:', error);
      next(error);
    }
  }
  async microsoftAuth(req, res, next) {
    try {
      const { token } = req.body;
      const result = await AuthService.microsoftAuth(token);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error en Microsoft auth:', error);
      next(error);
    }
  }
  async appleAuth(req, res, next) {
    try {
      const { token } = req.body;
      const result = await AuthService.appleAuth(token);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error en Apple auth:', error);
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error) {
      logger.error('Error en logout:', error);
      next(error);
    }
  }
}
module.exports = new AuthController();
