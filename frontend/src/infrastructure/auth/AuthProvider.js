// Abstract Factory Pattern: Proveedores de Autenticación
export class AuthProvider {
  async authenticate() {
    throw new Error('Method authenticate() must be implemented');
  }

  async getToken() {
    throw new Error('Method getToken() must be implemented');
  }
}

export default AuthProvider;
