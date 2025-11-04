// Servicio de Autenticación - Patrón Strategy
import { UserRepository } from '../repositories/UserRepository';

export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.currentUser = null;
  }

  // Strategy: Email/Password
  async loginWithEmail(email, password) {
    // TODO: Implementar lógica de autenticación
    console.log('Login with email:', email);
    return this.userRepository.authenticate(email, password);
  }

  // Strategy: Google OAuth
  async loginWithGoogle(googleToken) {
    // TODO: Implementar autenticación con Google
    console.log('Login with Google');
    return this.userRepository.authenticateWithGoogle(googleToken);
  }

  // Strategy: Microsoft OAuth
  async loginWithMicrosoft(microsoftToken) {
    // TODO: Implementar autenticación con Microsoft
    console.log('Login with Microsoft');
    return this.userRepository.authenticateWithMicrosoft(microsoftToken);
  }

  // Strategy: Apple OAuth
  async loginWithApple(appleToken) {
    // TODO: Implementar autenticación con Apple
    console.log('Login with Apple');
    return this.userRepository.authenticateWithApple(appleToken);
  }

  async register(userData) {
    // TODO: Implementar registro
    return this.userRepository.create(userData);
  }

  async logout() {
    // TODO: Implementar logout
    this.currentUser = null;
    localStorage.removeItem('token');
  }

  async forgotPassword(email) {
    // TODO: Implementar recuperación de contraseña
    return this.userRepository.requestPasswordReset(email);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

// Singleton
const authService = new AuthService();
export default authService;
