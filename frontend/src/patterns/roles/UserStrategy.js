import { RedirectionStrategy } from './RedirectionStrategy';
export class UserStrategy extends RedirectionStrategy {
  canHandle(user) {
    const role = user?.rol || user?.role || 'user';
    return role.toLowerCase() === 'user' || 
           role.toLowerCase() === 'student' || 
           role.toLowerCase() === 'cliente';
  }
  getRedirectionPath(user) {
    const role = user?.rol || user?.role || 'user';
    if (role.toLowerCase() === 'student') {
      return '/dashboard';
    }
    return '/catalog';
  }
  getRedirectionData(user) {
    return {
      ...super.getRedirectionData(user),
      message: `¡Bienvenido/a, ${user.firstName || 'Usuario'}!`,
      type: 'user'
    };
  }
}
