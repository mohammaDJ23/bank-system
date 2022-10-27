export class Env {
  static isDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  static isProd(): boolean {
    return process.env.NODE_ENV === 'production';
  }
}
