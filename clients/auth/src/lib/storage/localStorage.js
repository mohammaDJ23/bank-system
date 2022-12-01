export class LocalStorage {
  static setItem(key, val) {
    return localStorage.setItem(key, JSON.stringify(val));
  }

  static getItem(key) {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(''));
  }

  static removeItem(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}
