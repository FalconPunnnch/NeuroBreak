// Definición de endpoints de la API
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // OAuth
  GOOGLE_AUTH: '/auth/google',
  MICROSOFT_AUTH: '/auth/microsoft',
  APPLE_AUTH: '/auth/apple',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id) => /users/{id},
  USER_PROFILE: (id) => /users/{id}/profile,
  USER_FAVORITES: (id) => /users/{id}/favorites,
  USER_HISTORY: (id) => /users/{id}/history,
  USER_MOOD: (id) => /users/{id}/mood,
  
  // Microactivities
  MICROACTIVITIES: '/microactivities',
  MICROACTIVITY_BY_ID: (id) => /microactivities/{id},
  MICROACTIVITIES_SEARCH: '/microactivities/search',
  
  // Mood
  MOOD: '/mood',
  MOOD_STATISTICS: (userId) => /users/{userId}/mood/statistics,
  
  // History
  HISTORY: '/history',
  
  // Metrics
  METRICS: (userId) => /users/{userId}/metrics,
  
  // Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN_USERS: '/admin/users',
  ADMIN_MICROACTIVITIES: '/admin/microactivities'
};

export default ENDPOINTS;
