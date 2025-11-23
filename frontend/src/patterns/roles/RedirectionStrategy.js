export class RedirectionStrategy {
  getRedirectionPath(user) {
    throw new Error('getRedirectionPath debe ser implementado por las clases hijas');
  }
  canHandle(user) {
    throw new Error('canHandle debe ser implementado por las clases hijas');
  }
  getRedirectionData(user) {
    return {
      path: this.getRedirectionPath(user),
      replace: true
    };
  }
}
