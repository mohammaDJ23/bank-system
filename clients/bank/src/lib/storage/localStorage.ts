export class LocalStorage {
  static setItem(key: string, val: unknown): void {
    localStorage.setItem(key, JSON.stringify(val));
  }

  static getItem<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(''));
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}
