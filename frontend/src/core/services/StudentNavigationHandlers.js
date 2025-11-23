export class StudentDashboardNavigationHandler {
  handle(context) {
    const { setActiveSection } = context;
    setActiveSection('dashboard');
    return { success: true, section: 'dashboard' };
  }
}
export class StudentProfileNavigationHandler {
  handle(context) {
    const { setActiveSection } = context;
    setActiveSection('profile');
    return { success: true, section: 'profile' };
  }
}
export class StudentHistoryNavigationHandler {
  handle(context) {
    const { setActiveSection } = context;
    setActiveSection('history');
    return { success: true, section: 'history' };
  }
}
export class StudentMoodHistoryNavigationHandler {
  handle(context) {
    const { setActiveSection } = context;
    setActiveSection('moods');
    return { success: true, section: 'moods' };
  }
}
export class StudentCatalogNavigationHandler {
  handle(context) {
    const { navigate } = context;
    navigate('/catalog');
    return { success: true, section: 'catalog', navigated: true };
  }
}
export class StudentTimerNavigationHandler {
  handle(context) {
    const { navigate } = context;
    navigate('/timer');
    return { success: true, section: 'timer', navigated: true };
  }
}
export class StudentLogoutNavigationHandler {
  async handle(context) {
    const { logout, navigate } = context;
    try {
      await logout();
      navigate('/login');
      return { success: true, section: 'logout', navigated: true };
    } catch (error) {
      console.error('Error durante logout:', error);
      return { success: false, error: error.message };
    }
  }
}
export default class StudentNavigationHandlers {
  constructor(navigate, logout = null) {
    this.navigate = navigate;
    this.logout = logout;
    this.handlers = new Map([
      ['dashboard', new StudentDashboardNavigationHandler()],
      ['profile', new StudentProfileNavigationHandler()],
      ['history', new StudentHistoryNavigationHandler()],
      ['moods', new StudentMoodHistoryNavigationHandler()],
      ['catalog', new StudentCatalogNavigationHandler()],
      ['timer', new StudentTimerNavigationHandler()],
      ['logout', new StudentLogoutNavigationHandler()]
    ]);
  }
  async handleNavigation(sectionId, context = {}) {
    const handler = this.handlers.get(sectionId);
    if (!handler) {
      console.warn(`No handler found for section: ${sectionId}`);
      return { success: false, error: `Unknown section: ${sectionId}` };
    }
    const navigationContext = {
      navigate: this.navigate,
      logout: this.logout,
      setActiveSection: context.setActiveSection,
      ...context
    };
    return await handler.handle(navigationContext);
  }
  navigateToExternal(sectionId) {
    switch (sectionId) {
      case 'catalog':
        this.navigate('/catalog');
        break;
      case 'timer':
        this.navigate('/timer');
        break;
      default:
        console.warn(`Unknown external section: ${sectionId}`);
    }
  }
}
