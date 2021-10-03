import * as vscode from 'vscode';
import * as madge from 'madge';

export class DependencyFinder {
  constructor(
    private window: typeof vscode.window,
    private progressLocation: typeof vscode.ProgressLocation,
  ) { }

  async findCircular(filePath: string) {
    const dependencyTree = await this.window.withProgress({
      location: this.progressLocation.Notification,
      title: '[Circular dependencies] Analyzing dependency tree...',
      cancellable: true,
    }, (progress, token) => {
      // TODO: Make this cancelable.
      console.log('waiting....');
      console.log(progress, token);
      return madge(filePath);
      // return new Promise<string>((resolve, reject) => {
      //   setTimeout(() => {
      //     console.log('resolve');
      //     resolve('hallo');
      //   }, 5000);
      // });
    });

    return dependencyTree.circular();
  }
}
