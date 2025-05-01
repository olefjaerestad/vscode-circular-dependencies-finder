import * as vscode from 'vscode';
import * as madge from 'madge';

interface FindCircularConfig {
  /**
   * Exclude dynamic imports (`import(module)`) when calculating circular dependencies.
   */
  excludeDynamicImports?: boolean;
  /**
   * Exclude `import type` statements when calculating circular dependencies.
   */
  excludeTypeImports?: boolean;
}

export class DependencyFinder {
  constructor(
    private window: typeof vscode.window,
    private progressLocation: typeof vscode.ProgressLocation,
  ) { }

  _toMadgeConfig(config?: FindCircularConfig): madge.MadgeConfig {
    return {
      detectiveOptions: {
        es6: {
          skipAsyncImports: config?.excludeDynamicImports,
          skipTypeImports: config?.excludeTypeImports,
        },
        ts: {
          skipAsyncImports: config?.excludeDynamicImports,
          skipTypeImports: config?.excludeTypeImports,
        },
        tsx: {
          skipAsyncImports: config?.excludeDynamicImports,
          skipTypeImports: config?.excludeTypeImports,
        },
      },
    };
  }

  async findCircular(filePath: string, config?: FindCircularConfig) {
    const dependencyArray = await this.window.withProgress({
      location: this.progressLocation.Notification,
      title: '[Circular Dependencies] Analyzing dependency tree...',
      cancellable: true,
    }, (progress, token) => {
      // TODO: Ensure that this is cancelable when working with large dependency trees.
      return new Promise<madge.MadgeInstance>((resolve, reject) => {
        token.onCancellationRequested(() => {
          reject('Canceled.');
        });
        return madge(filePath, this._toMadgeConfig(config)).then(resolve);
      });
    });

    return dependencyArray.circular();
  }
}
