class AuthService {
  static getToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }
  static setToken(token, remember = false) {
    if (remember) {
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('authToken', token);
    }
  }
  static removeToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }
  static logout() {
    this.removeToken();
    window.location.href = '/login';
  }
  static isAuthenticated() {
    return !!this.getToken();
  }
}
export { AuthService };
