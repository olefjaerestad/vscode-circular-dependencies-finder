// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { FilePicker } from './classes/FilePicker';
import { DependencyFinder } from './classes/DependencyFinder';
import { WebView } from './classes/WebView';

// This method is called once, when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined (and must match the command field) in the package.json file
	let disposable = vscode.commands.registerCommand('vscode-circular-dependencies-finder.find', async () => {
    try {
      const file = await new FilePicker(vscode.window, vscode.workspace).pick();
      if (!file) {
        return;
      }

      const circularDependencies = await new DependencyFinder(vscode.window, vscode.ProgressLocation)
        .findCircular(
          // TODO: Replace `mock/index.ts` with file.
          // @ts-ignore
          resolve(join(dirname(fileURLToPath(import.meta.url))), 'mock/index.ts')
        );

      new WebView(vscode, context).create(circularDependencies);
    } catch(error) {
      vscode.window.showErrorMessage(`[Circular dependencies] error: ${error}`);
    }
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
