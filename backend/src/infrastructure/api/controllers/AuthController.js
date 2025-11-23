const AuthService = require('../../../core/application/services/AuthService');
const EmailService = require('../../../core/application/services/EmailService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.emailService = new EmailService();
  }
  async register(req, res) {
    try {
      const { firstName, lastName, email, password, role = 'student' } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son obligatorios'
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de correo inválido'
        });
      }
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 8 caracteres'
        });
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe contener mayúsculas, minúsculas y números'
        });
      }
      const existingUser = await this.authService.findUserByEmail(email.toLowerCase());
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'El correo ya está registrado'
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.authService.createUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role
      });
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email,
          role: newUser.role 
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }
      );
      try {
        await this.emailService.sendWelcomeEmail(
          newUser.email,
          newUser.first_name || newUser.firstName
        );
        console.log(`✅ Email de bienvenida enviado a: ${newUser.email}`);
      } catch (emailError) {
        console.error('❌ Error al enviar email de bienvenida:', emailError);
      }
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: newUser.id,
          firstName: newUser.first_name || newUser.firstName,
          lastName: newUser.last_name || newUser.lastName,
          email: newUser.email,
          role: newUser.role,
          profilePicture: newUser.profile_picture || null
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar usuario',
        error: error.message
      });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son obligatorios'
        });
      }
      const user = await this.authService.findUserByEmail(email.toLowerCase());
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      if (!user.password) {
        return res.status(401).json({
          success: false,
          message: 'Esta cuenta fue registrada con Google/Microsoft. Por favor usa el botón correspondiente para iniciar sesión.'
        });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }
      );
      const userResponse = {
        id: user.id,
        firstName: user.first_name || user.firstName || 'Sin nombre',
        lastName: user.last_name || user.lastName || 'Sin apellido',
        email: user.email,
        role: user.role,
        profilePicture: user.profile_picture || user.profilePicture || null
      };
      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        token,
        user: userResponse
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión',
        error: error.message
      });
    }
  }
  async getCurrentUser(req, res) {
    try {
      const user = await this.authService.findUserById(req.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          firstName: user.first_name || user.firstName,
          lastName: user.last_name || user.lastName,
          email: user.email,
          role: user.role,
          profilePicture: user.profile_picture || user.profilePicture || null
        }
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuario',
        error: error.message
      });
    }
  }
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'El correo es obligatorio'
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de correo inválido'
        });
      }
      const user = await this.authService.findUserByEmail(email.toLowerCase());
      if (!user) {
        return res.status(200).json({
          success: true,
          message: 'Si el correo existe, recibirás un email con instrucciones'
        });
      }
      if (!user.password || user.password === null) {
        return res.status(400).json({
          success: false,
          message: 'Esta cuenta fue registrada con Google/Microsoft. No puedes cambiar la contraseña. Inicia sesión con el botón correspondiente.'
        });
      }
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000);
      await this.authService.savePasswordResetToken(
        user.id,
        resetTokenHash,
        resetTokenExpiry
      );
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
      try {
        await this.emailService.sendPasswordResetEmail(
          user.email,
          resetUrl,
          user.first_name || user.firstName
        );
        console.log(`✅ Email de recuperación enviado a: ${user.email}`);
      } catch (emailError) {
        console.error('❌ Error al enviar email:', emailError);
      }
      res.status(200).json({
        success: true,
        message: 'Si el correo existe, recibirás un email con instrucciones'
      });
    } catch (error) {
      console.error('Error en forgot password:', error);
      res.status(500).json({
        success: false,
        message: 'Error al procesar la solicitud',
        error: error.message
      });
    }
  }
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Token y nueva contraseña son obligatorios'
        });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 8 caracteres'
        });
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe contener mayúsculas, minúsculas y números'
        });
      }
      const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
      const user = await this.authService.findUserByResetToken(tokenHash);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token inválido o expirado'
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.authService.updatePassword(user.id, hashedPassword);
      console.log(`✅ Contraseña actualizada para: ${user.email}`);
      res.status(200).json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error en reset password:', error);
      res.status(500).json({
        success: false,
        message: 'Error al restablecer contraseña',
        error: error.message
      });
    }
  }
  async googleCallback(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
      }
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }
      );
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Error en Google callback:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_error`);
    }
  }
  async microsoftCallback(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
      }
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }
      );
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Error en Microsoft callback:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_error`);
    }
  }
}
module.exports = new AuthController();
