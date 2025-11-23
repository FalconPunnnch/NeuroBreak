import { RedirectionStrategy } from './RedirectionStrategy';
export class AdminStrategy extends RedirectionStrategy {
  canHandle(user) {
    const role = user?.rol || user?.role || '';
    return role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator';
  }
  getRedirectionPath(user) {
    if (!this.canHandle(user)) {
      throw new Error('Usuario no autorizado para acceder al panel de administrador');
    }
    return '/admin/dashboard';
  }
  getRedirectionData(user) {
    return {
      ...super.getRedirectionData(user),
      message: `Bienvenido al panel de administrador, ${user.firstName || 'Admin'}!`,
      type: 'admin'
    };
  }
}
