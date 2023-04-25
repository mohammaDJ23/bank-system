interface Navigate {
  (path: string): void;
}

interface MountOptions {
  onChildNavigate: Navigate;
  initialPath: string;
  history: BrowserHistory | MemoryHistory;
}

interface MountExportation {
  onParentNavigate: Navigate;
}

interface MicroAppExportation {
  mount(options: Partial<MountOptions>): MountExportation;
  unMount(): void;
}

interface MicroApp {
  (el: Element): MicroAppExportation;
}

interface RedirectionDetailObj {
  path: string;
}

declare module 'auth/AuthApp' {
  export const app: MicroApp;
}

declare module 'bank/BankApp' {
  export const app: MicroApp;
}
