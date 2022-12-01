export class LocalStorage {
  static getItem<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(''));
  }

  static setItem(key: string, value: unknown): void {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}
