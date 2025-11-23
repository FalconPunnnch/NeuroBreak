class NavigationService {
  constructor() {
    this.handlers = new Map();
  }
  registerHandler(section, handler) {
    this.handlers.set(section, handler);
  }
  navigate(section, context = {}) {
    const handler = this.handlers.get(section);
    if (handler) {
      return this.executeNavigation(handler, context);
    }
    return this.handleUnknownSection(section);
  }
  executeNavigation(handler, context) {
    try {
      return handler.handle(context);
    } catch (error) {
      console.error('Error en navegación:', error);
      throw new Error(`Error al navegar: ${error.message}`);
    }
  }
  handleUnknownSection(section) {
    console.warn(`Sección desconocida: ${section}`);
    return { success: false, error: `Sección no encontrada: ${section}` };
  }
  notifyChange(section, activeState) {
    const event = new CustomEvent('navigationChange', {
      detail: { section, activeState }
    });
    window.dispatchEvent(event);
  }
}
export default NavigationService;
