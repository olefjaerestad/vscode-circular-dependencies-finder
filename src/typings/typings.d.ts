declare global {
  // interface Window {
  //   dependencyTree: string[][];
  // }
  namespace globalThis {
    var dependencyTree: string[][];
    var acquireVsCodeApi: () => {
      getState: () => Record<string, any>;
      postMessage: (message: string, transfer: any) => void;
      setState: (newState: Record<string, any>) => void;
    }
  }
}

export {}
