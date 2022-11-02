declare module 'auth/AuthApp' {
  export declare interface Navigator {
    (path: string): void;
  }

  export declare interface NavigationOptions {
    onChildNavigate: Navigator;
  }

  export declare interface MountExportation {
    onParentNavigate: Navigator;
  }

  export declare function mount(
    element: Element,
    navigationOptions: NavigationOptions,
  ): MountExportation;
}
