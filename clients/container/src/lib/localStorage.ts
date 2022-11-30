export function getItem<T>(key: string): T {
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(''));
}

export function setItem(key: string, value: unknown): void {
  return localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

export function clear() {
  localStorage.clear();
}
