// Servicio de Autenticación - Patrón Strategy
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.config');
const UserRepository = require('../repositories/UserRepository');
const logger = require('../../utils/logger');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(email, password) {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token JWT
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async register(userData) {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(userData.email);
    
    if (existingUser) {
      throw new Error('El correo ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear usuario
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    // Generar token
    const token = this.generateToken(newUser);

    return {
      user: {
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
        role: newUser.role
      },
      token
    };
  }

  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      // No revelar si el usuario existe o no
      return { message: 'Si el correo existe, recibirás instrucciones' };
    }

    // TODO: Generar token de recuperación y enviar email
    const resetToken = this.generatePasswordResetToken(user);
    
    logger.info(`Reset token generado para usuario: ${email}`);
    
    return { message: 'Correo enviado' };
  }

  async resetPassword(token, newPassword) {
    // TODO: Verificar token y actualizar contraseña
    logger.info('Password reset solicitado');
  }

  async googleAuth(token) {
    // TODO: Verificar token de Google y autenticar/registrar usuario
    logger.info('Google auth solicitado');
  }

  async microsoftAuth(token) {
    // TODO: Verificar token de Microsoft y autenticar/registrar usuario
    logger.info('Microsoft auth solicitado');
  }

  async appleAuth(token) {
    // TODO: Verificar token de Apple y autenticar/registrar usuario
    logger.info('Apple auth solicitado');
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      authConfig.jwt.secret,
      {
        expiresIn: authConfig.jwt.expiresIn
      }
    );
  }

  generatePasswordResetToken(user) {
    return jwt.sign(
      {
        id: user.id,
        type: 'password-reset'
      },
      authConfig.jwt.secret,
      {
        expiresIn: '1h'
      }
    );
  }
}

module.exports = new AuthService();
