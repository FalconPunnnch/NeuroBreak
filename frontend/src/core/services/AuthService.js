import apiClient from '../../infrastructure/api/apiClient';
export class AuthService {
  constructor() {
    this.currentUser = null;
  }
  async loginWithEmail(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      if (response.data && response.data.token) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser = user;
        return {
          success: true,
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            rol: user.role || user.rol || 'user' // Usar role del backend
          }
        };
      }
      return {
        success: false,
        error: 'Credenciales inválidas'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error de conexión'
      };
    }
  }
  async loginWithGoogle(googleToken) {
    console.log('Login with Google');
    return this.userRepository.authenticateWithGoogle(googleToken);
  }
  async loginWithMicrosoft(microsoftToken) {
    console.log('Login with Microsoft');
    return this.userRepository.authenticateWithMicrosoft(microsoftToken);
  }
  async loginWithApple(appleToken) {
    console.log('Login with Apple');
    return this.userRepository.authenticateWithApple(appleToken);
  }
  async register(userData) {
    return this.userRepository.create(userData);
  }
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Error al cerrar sesión en el servidor:', error);
    }
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  getCurrentUser() {
    if (!this.currentUser) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          this.currentUser = JSON.parse(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
        }
      }
    }
    return this.currentUser;
  }
  isAuthenticated() {
    return !!localStorage.getItem('token') && !!this.getCurrentUser();
  }
  getUserRole() {
    const user = this.getCurrentUser();
    return user?.rol || user?.role || 'user';
  }
}
const authService = new AuthService();
export default authService;
