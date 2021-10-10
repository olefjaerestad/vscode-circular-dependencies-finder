declare global {
  // interface Window {
  //   dependencyArray: string[][];
  // }
  namespace globalThis {
    var dependencyArray: string[][];
    var acquireVsCodeApi: () => {
      getState: () => Record<string, any>;
      postMessage: (message: string, transfer: any) => void;
      setState: (newState: Record<string, any>) => void;
    }
  }
}

export {}
