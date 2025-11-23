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
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }
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
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El correo ya está registrado');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });
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
      return { message: 'Si el correo existe, recibirás instrucciones' };
    }
    const resetToken = this.generatePasswordResetToken(user);
    logger.info(`Reset token generado para usuario: ${email}`);
    return { message: 'Correo enviado' };
  }
  async resetPassword(token, newPassword) {
    logger.info('Password reset solicitado');
  }
  async googleAuth(token) {
    logger.info('Google auth solicitado');
  }
  async microsoftAuth(token) {
    logger.info('Microsoft auth solicitado');
  }
  async appleAuth(token) {
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
