interface Navigate {
  (path: string): void;
}

interface MountOptions {
  onChildNavigate: Navigate;
  initialPath: string;
}

interface MountExportation {
  onParentNavigate: Navigate;
}

interface Mount {
  (element: Element): void;
}

interface RedirectionDetailObj {
  path: string;
}

declare module 'auth/AuthApp' {
  export const mount: Mount;
}

declare module 'bank/BankApp' {
  export const mount: Mount;
}
