// Proveedor de autenticación con Google
import AuthProvider from './AuthProvider';
import apiClient from '../api/apiClient';

export class GoogleAuthProvider extends AuthProvider {
  async authenticate(googleToken) {
    try {
      const response = await apiClient.post('/auth/google', { token: googleToken });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  }

  async getToken() {
    return localStorage.getItem('token');
  }
}

export default GoogleAuthProvider;
