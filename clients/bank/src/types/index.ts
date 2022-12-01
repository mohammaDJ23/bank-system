import { BrowserHistory, MemoryHistory } from 'history';

export namespace Bank {
  interface OnChildNavigate {
    (path: string): void;
  }

  interface OnParentNavigate {
    (path: string): void;
  }

  export interface MountOptions {
    onChildNavigate?: OnChildNavigate;
    history?: BrowserHistory;
    initialPath?: string;
  }

  export interface MountExportation {
    onParentNavigate: OnParentNavigate;
  }

  export interface AppImportation {
    history: BrowserHistory | MemoryHistory;
  }
}
