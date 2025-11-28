class LocalStorageService {
  constructor() {
    if (LocalStorageService.instance) {
      return LocalStorageService.instance;
    }
    LocalStorageService.instance = this;
  }
  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }
  removeItem(key) {
    localStorage.removeItem(key);
  }
  clear() {
    localStorage.clear();
  }
}
const localStorageService = new LocalStorageService();
Object.freeze(localStorageService);
export default localStorageService;
