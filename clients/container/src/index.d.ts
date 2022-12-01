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
  (element: Element, options: MountOptions): MountExportation;
}

declare module 'auth/AuthApp' {
  export const mount: Mount;
}

declare module 'bank/BankApp' {
  export const mount: Mount;
}
