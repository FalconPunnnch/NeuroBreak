// Proveedor de autenticación con Apple
import AuthProvider from './AuthProvider';
import apiClient from '../api/apiClient';

export class AppleAuthProvider extends AuthProvider {
  async authenticate(appleToken) {
    try {
      const response = await apiClient.post('/auth/apple', { token: appleToken });
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

export default AppleAuthProvider;
