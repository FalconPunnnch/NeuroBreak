import { AuthService } from '../auth/AuthService';
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
};
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
  getAuthHeaders() {
    const token = AuthService.getToken();
    return {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
  handleError(error, endpoint) {
    console.error(`API Error en ${endpoint}:`, error);
    if (!error.response) {
      return {
        success: false,
        error: 'Error de conexión. Verifique su conexión a internet.',
        code: 'NETWORK_ERROR',
      };
    }
    const { status, data } = error.response;
    switch (status) {
      case 401:
        AuthService.logout();
        return {
          success: false,
          error: 'Sesión expirada. Por favor, inicie sesión nuevamente.',
          code: 'UNAUTHORIZED',
        };
      case 403:
        return {
          success: false,
          error: 'No tiene permisos para realizar esta acción.',
          code: 'FORBIDDEN',
        };
      case 404:
        return {
          success: false,
          error: 'Recurso no encontrado.',
          code: 'NOT_FOUND',
        };
      case 422:
        return {
          success: false,
          error: data?.message || 'Datos inválidos.',
          code: 'VALIDATION_ERROR',
          details: data?.errors,
        };
      case 500:
        return {
          success: false,
          error: 'Error interno del servidor. Intente nuevamente.',
          code: 'SERVER_ERROR',
        };
      default:
        return {
          success: false,
          error: data?.message || 'Error desconocido.',
          code: 'UNKNOWN_ERROR',
        };
    }
  }
  async makeRequest(method, endpoint, data = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = options.useAuth !== false ? this.getAuthHeaders() : this.defaultHeaders;
    const requestOptions = {
      method: method.toUpperCase(),
      headers: {
        ...headers,
        ...options.headers,
      },
      signal: options.signal,
    };
    if (data && ['POST', 'PUT', 'PATCH'].includes(requestOptions.method)) {
      requestOptions.body = JSON.stringify(data);
    }
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.retries; attempt++) {
      try {
        console.log(`API Request [Intento ${attempt}]: ${method.toUpperCase()} ${url}`);
        const response = await fetch(url, requestOptions);
        if (response.ok) {
          const result = response.status === 204 ? {} : await response.json();
          console.log(`API Response [${response.status}]:`, result);
          return {
            success: true,
            data: result,
            status: response.status,
          };
        }
        const errorData = await response.json().catch(() => ({}));
        lastError = {
          response: {
            status: response.status,
            data: errorData,
          },
        };
        if (response.status >= 400 && response.status < 500) {
          break;
        }
      } catch (error) {
        lastError = error;
        console.warn(`API Request failed [Intento ${attempt}]:`, error.message);
        if (attempt < API_CONFIG.retries) {
          await new Promise(resolve => 
            setTimeout(resolve, API_CONFIG.retryDelay * attempt)
          );
        }
      }
    }
    return this.handleError(lastError, endpoint);
  }
  async get(endpoint, options = {}) {
    return this.makeRequest('GET', endpoint, null, options);
  }
  async post(endpoint, data, options = {}) {
    return this.makeRequest('POST', endpoint, data, options);
  }
  async put(endpoint, data, options = {}) {
    return this.makeRequest('PUT', endpoint, data, options);
  }
  async patch(endpoint, data, options = {}) {
    return this.makeRequest('PATCH', endpoint, data, options);
  }
  async delete(endpoint, options = {}) {
    return this.makeRequest('DELETE', endpoint, null, options);
  }
  async getStudentStats(userId) {
    try {
      const response = await this.get(`/students/${userId}/stats`);
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas del estudiante:', error);
      return {
        success: false,
        error: 'Error al cargar estadísticas',
        data: this.getDefaultStats(),
      };
    }
  }
  async getStudentActivityHistory(userId, options = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.category) params.append('category', options.category);
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);
    const queryString = params.toString();
    const endpoint = `/students/${userId}/activity-history${queryString ? `?${queryString}` : ''}`;
    try {
      const response = await this.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error obteniendo historial de actividades:', error);
      return {
        success: false,
        error: 'Error al cargar historial de actividades',
        data: this.getDefaultActivityHistory(),
      };
    }
  }
  async getStudentMoodHistory(userId, options = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    if (options.period) params.append('period', options.period);
    const queryString = params.toString();
    const endpoint = `/students/${userId}/mood-history${queryString ? `?${queryString}` : ''}`;
    try {
      const response = await this.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error obteniendo historial de estados de ánimo:', error);
      return {
        success: false,
        error: 'Error al cargar historial de estados de ánimo',
        data: this.getDefaultMoodHistory(),
      };
    }
  }
  async updateStudentProfile(userId, profileData) {
    try {
      const response = await this.put(`/students/${userId}/profile`, profileData);
      return response;
    } catch (error) {
      console.error('Error actualizando perfil del estudiante:', error);
      return {
        success: false,
        error: 'Error al actualizar perfil',
      };
    }
  }
  async uploadProfilePicture(userId, file) {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await this.makeRequest(
        'POST',
        `/students/${userId}/profile-picture`,
        formData,
        {
          headers: {
            'Authorization': this.getAuthHeaders().Authorization,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error subiendo foto de perfil:', error);
      return {
        success: false,
        error: 'Error al subir foto de perfil',
      };
    }
  }
  getDefaultStats() {
    return {
      totalActivities: 0,
      totalTime: 0,
      currentStreak: 0,
      weeklyGoal: 0,
      weeklyProgress: 0,
      favoriteCategory: 'Sin datos',
      averageSession: 0,
      completionRate: 0,
      moodTrend: 'stable',
      lastActivity: null,
    };
  }
  getDefaultActivityHistory() {
    return {
      activities: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
      filters: {
        categories: [],
        dateRange: null,
      },
    };
  }
  getDefaultMoodHistory() {
    return {
      moods: [],
      analytics: {
        averageMood: 0,
        moodDistribution: {},
        trends: [],
        insights: [],
        recommendations: [],
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
    };
  }
}
const apiService = new ApiService();
export default apiService;
