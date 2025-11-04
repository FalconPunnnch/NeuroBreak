// Configuración de autenticación OAuth
export const AUTH_CONFIG = {
  GOOGLE: {
    CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    REDIRECT_URI: window.location.origin + '/auth/google/callback'
  },
  MICROSOFT: {
    CLIENT_ID: process.env.REACT_APP_MICROSOFT_CLIENT_ID,
    REDIRECT_URI: window.location.origin + '/auth/microsoft/callback'
  },
  APPLE: {
    CLIENT_ID: process.env.REACT_APP_APPLE_CLIENT_ID,
    REDIRECT_URI: window.location.origin + '/auth/apple/callback'
  }
};

export default AUTH_CONFIG;
