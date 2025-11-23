import { AdminStrategy } from './AdminStrategy';
import { UserStrategy } from './UserStrategy';
export class RoleStrategyFactory {
  constructor() {
    this.strategies = [
      new AdminStrategy(),
      new UserStrategy()
    ];
  }
  getStrategy(user) {
    if (!user) {
      throw new Error('Usuario requerido para determinar estrategia');
    }
    const strategy = this.strategies.find(strategy => strategy.canHandle(user));
    if (!strategy) {
      console.warn(`No se encontró estrategia para el rol: ${user.rol || user.role}. Usando estrategia por defecto.`);
      return new UserStrategy();
    }
    return strategy;
  }
  registerStrategy(strategy) {
    if (!(strategy instanceof RedirectionStrategy)) {
      throw new Error('La estrategia debe heredar de RedirectionStrategy');
    }
    this.strategies.unshift(strategy);
  }
  getRedirectionData(user) {
    const strategy = this.getStrategy(user);
    return strategy.getRedirectionData(user);
  }
}
export const roleStrategyFactory = new RoleStrategyFactory();
