import * as vscode from 'vscode';
import * as madge from 'madge';

export class DependencyFinder {
  constructor(
    private window: typeof vscode.window,
    private progressLocation: typeof vscode.ProgressLocation,
  ) { }

  async findCircular(filePath: string) {
    const dependencyArray = await this.window.withProgress({
      location: this.progressLocation.Notification,
      title: '[Circular dependencies] Analyzing dependency tree...',
      cancellable: true,
    }, (progress, token) => {
      // TODO: Ensure that this is cancelable when working with large dependency trees.
      return new Promise<madge.MadgeInstance>((resolve, reject) => {
        token.onCancellationRequested(() => {
          reject('Canceled.');
        });
        return madge(filePath).then(resolve);
      });
    });

    return dependencyArray.circular();
  }
}
