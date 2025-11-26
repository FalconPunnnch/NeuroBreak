import axios from 'axios';
import API_CONFIG from '../../config/api.config';
class ApiClient {
  constructor() {
    if (ApiClient.instance) {
      return ApiClient.instance;
    }
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.setupInterceptors();
    ApiClient.instance = this;
  }
  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          console.log('? Error response:', {
            status: error.response.status,
            data: error.response.data,
            url: error.config.url,
            method: error.config.method
          });
        }
        if (error.response?.status === 401) {
          console.log('?? 401 Unauthorized - removing token and redirecting');
          localStorage.removeItem('token');
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }
  get(url, config) {
    return this.client.get(url, config);
  }
  post(url, data, config) {
    return this.client.post(url, data, config);
  }
  put(url, data, config) {
    return this.client.put(url, data, config);
  }
  delete(url, config) {
    return this.client.delete(url, config);
  }
  patch(url, data, config) {
    return this.client.patch(url, data, config);
  }
}
const apiClient = new ApiClient();
Object.freeze(apiClient);
export default apiClient;
