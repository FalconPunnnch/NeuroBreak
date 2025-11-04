// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: '/auth',
    USERS: '/users',
    MICROACTIVITIES: '/microactivities',
    MOOD: '/mood',
    HISTORY: '/history',
    METRICS: '/metrics',
    ADMIN: '/admin'
  }
};

export default API_CONFIG;
