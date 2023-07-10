import CryptoJs from 'crypto-js';

export class LocalStorage {
  static setItem(key: string, val: unknown): void {
    const encryptedVal = CryptoJs.AES.encrypt(
      JSON.stringify(val),
      process.env.CACHE_SECRET_KEY!
    ).toString();
    localStorage.setItem(key, encryptedVal);
  }

  static getItem<T>(key: string): T {
    const val = localStorage.getItem(key) || '';
    const decryptedVal = CryptoJs.AES.decrypt(val, process.env.CACHE_SECRET_KEY!).toString(
      CryptoJs.enc.Utf8
    );
    return decryptedVal ? JSON.parse(decryptedVal) : decryptedVal;
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}
