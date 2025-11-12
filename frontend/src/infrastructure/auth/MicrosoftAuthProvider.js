// Proveedor de autenticación con Microsoft
import AuthProvider from './AuthProvider';
import apiClient from '../api/apiClient';

export class MicrosoftAuthProvider extends AuthProvider {
  async authenticate(microsoftToken) {
    try {
      const response = await apiClient.post('/auth/microsoft', { token: microsoftToken });
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

export default MicrosoftAuthProvider;
