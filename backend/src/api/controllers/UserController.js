const path = require('path');
const fs = require('fs').promises;
const authService = require('../../services/AuthService');
class UserController {
  constructor() {
    this.authService = authService;
  }
  async uploadProfilePicture(req, res) {
    try {
      const userId = req.userId; // Del middleware de autenticación
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionó ninguna imagen'
        });
      }
      const imagePath = `/uploads/profile-pictures/${req.file.filename}`;
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
      if (user.profile_picture) {
        const filePath = path.join(__dirname, '../../../..', user.profile_picture);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.log('No se pudo eliminar el archivo:', err);
        }
      }
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
  async updateProfile(req, res) {
    try {
  const userId = req.userId;
  const { firstName, lastName, bio } = req.body;
  console.log('🔄 [updateProfile] userId:', userId);
  console.log('🔄 [updateProfile] datos recibidos:', { firstName, lastName, bio });
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
      const updatedUser = await this.authService.updateProfile(userId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio ? bio.trim() : null
      });
      console.log('🔄 [updateProfile] resultado DB:', updatedUser);
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
