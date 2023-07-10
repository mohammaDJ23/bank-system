interface MicroAppExportation {
  mount(): void;
  unMount(): void;
}

interface MicroApp {
  (el: Element): MicroAppExportation;
}

interface RedirectionObj {
  path: string;
}

declare module 'auth/AuthApp' {
  export const app: MicroApp;
}

declare module 'bank/BankApp' {
  export const app: MicroApp;
}
