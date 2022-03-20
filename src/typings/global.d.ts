import { IMessageEventPayload, IState, TDependencyArray } from "../types";

declare global {
  namespace globalThis {
    var dependencyArray: TDependencyArray;
    var acquireVsCodeApi: () => {
      getState: () => IState;
      postMessage: <D = any>(payload: IMessageEventPayload<D>) => void;
      setState: (newState: IState) => void;
    }
  }
}
