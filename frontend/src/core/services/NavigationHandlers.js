export class NavigationHandler {
  handle(context) {
    throw new Error('NavigationHandler debe implementar el método handle');
  }
}
export class DashboardNavigationHandler extends NavigationHandler {
  handle({ setActiveSection }) {
    setActiveSection('dashboard');
    return { success: true, section: 'dashboard' };
  }
}
export class ProfileNavigationHandler extends NavigationHandler {
  handle({ navigate }) {
    navigate('/profile');
    return { success: true, section: 'profile', redirect: true };
  }
}
export class MicroactivitiesNavigationHandler extends NavigationHandler {
  handle({ setActiveSection }) {
    setActiveSection('microactivities');
    return { success: true, section: 'microactivities' };
  }
}
export class LogoutNavigationHandler extends NavigationHandler {
  handle({ logout, navigate }) {
    return this.handleLogout(logout, navigate);
  }
  async handleLogout(logoutFn, navigateFn) {
    try {
      await logoutFn();
      navigateFn('/');
      return { success: true, section: 'logout', redirect: true };
    } catch (error) {
      console.error('Error durante logout:', error);
      throw new Error('Error al cerrar sesión');
    }
  }
}
