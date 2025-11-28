import { UserRepository } from '../repositories/UserRepository';
export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async updateProfile(userId, profileData) {
    return this.userRepository.update(userId, profileData);
  }
  async uploadProfilePicture(userId, file) {
    return this.userRepository.uploadProfilePicture(userId, file);
  }
  async changePassword(userId, oldPassword, newPassword) {
    return this.userRepository.changePassword(userId, oldPassword, newPassword);
  }
  async getUserById(userId) {
    return this.userRepository.findById(userId);
  }
}
export default UserService;
