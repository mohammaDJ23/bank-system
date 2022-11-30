export namespace Bank {
  interface OnChildNavigate {
    (path: string): void;
  }

  interface OnParentNavigate {
    (path: string): void;
  }

  export interface MountOptions {
    onChildNavigate: OnChildNavigate;
  }

  export interface MountExportation {
    onParentNavigate: OnParentNavigate;
  }
}
