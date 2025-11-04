// User Controller - Con edición de perfil
// backend/src/infrastructure/api/controllers/UserController.js

const path = require('path');
const fs = require('fs').promises;
const AuthService = require('../../../core/application/services/AuthService');

class UserController {
  constructor() {
    this.authService = new AuthService();
  }

  // POST /api/users/profile-picture
  async uploadProfilePicture(req, res) {
    try {
      const userId = req.userId; // Del middleware de autenticación
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionó ninguna imagen'
        });
      }

      // La ruta donde se guardó la imagen (por multer)
      const imagePath = `/uploads/profile-pictures/${req.file.filename}`;

      // Actualizar la ruta de la imagen en la base de datos
      const updatedUser = await this.authService.updateProfilePicture(
        userId,
        imagePath
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      console.log(`✅ Foto de perfil actualizada para usuario ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Foto de perfil actualizada exitosamente',
        profilePicture: imagePath
      });

    } catch (error) {
      console.error('Error al subir foto de perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error al subir la foto',
        error: error.message
      });
    }
  }

  // DELETE /api/users/profile-picture
  async deleteProfilePicture(req, res) {
    try {
      const userId = req.userId;

      const user = await this.authService.findUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Si tiene foto, eliminar el archivo
      if (user.profile_picture) {
        const filePath = path.join(__dirname, '../../../..', user.profile_picture);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.log('No se pudo eliminar el archivo:', err);
        }
      }

      // Actualizar BD para quitar la foto
      await this.authService.updateProfilePicture(userId, null);

      res.status(200).json({
        success: true,
        message: 'Foto de perfil eliminada'
      });

    } catch (error) {
      console.error('Error al eliminar foto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la foto'
      });
    }
  }

  // PUT /api/users/profile - Editar información del perfil
  async updateProfile(req, res) {
    try {
      const userId = req.userId;
      const { firstName, lastName, bio } = req.body;

      // Validaciones
      if (!firstName || !firstName.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El nombre es obligatorio'
        });
      }

      if (!lastName || !lastName.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El apellido es obligatorio'
        });
      }

      // Actualizar perfil en la base de datos
      const updatedUser = await this.authService.updateProfile(userId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio ? bio.trim() : null
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      console.log(`✅ Perfil actualizado para usuario ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        user: {
          id: updatedUser.id,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          email: updatedUser.email,
          role: updatedUser.role,
          bio: updatedUser.bio,
          profilePicture: updatedUser.profile_picture
        }
      });

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el perfil',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();