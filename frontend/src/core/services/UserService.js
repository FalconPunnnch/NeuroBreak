// Servicio de Usuario
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async updateProfile(userId, profileData) {
    // TODO: Implementar actualización de perfil
    return this.userRepository.update(userId, profileData);
  }

  async uploadProfilePicture(userId, file) {
    // TODO: Implementar subida de foto de perfil
    return this.userRepository.uploadProfilePicture(userId, file);
  }

  async changePassword(userId, oldPassword, newPassword) {
    // TODO: Implementar cambio de contraseña
    return this.userRepository.changePassword(userId, oldPassword, newPassword);
  }

  async getUserById(userId) {
    return this.userRepository.findById(userId);
  }
}

export default UserService;
