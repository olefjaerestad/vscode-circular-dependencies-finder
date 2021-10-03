// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { FilePicker } from './classes/FilePicker';
import { DependencyFinder } from './classes/DependencyFinder';
import { WebView } from './classes/WebView';
import { WebViewSerializer } from './classes/WebViewSerializer';

// This method is called once, when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined (and must match the command field) in the package.json file
	const disposableCommand = vscode.commands.registerCommand('vscode-circular-dependencies-finder.find', async () => {
    try {
      const file = await new FilePicker(vscode.window, vscode.workspace).pick();
      if (!file) {
        return;
      }

      const circularDependencies = await new DependencyFinder(vscode.window, vscode.ProgressLocation)
        .findCircular(
          // resolve(join(__dirname), '../src/mock/inddex.ts') // TODO: Remove
          file
        );

      new WebView(vscode, context).create(circularDependencies);
    } catch(error) {
      vscode.window.setStatusBarMessage(`[Circular dependencies] ${error}`, 5000);
    }
	});

  // TODO: Ensure that this works with multiple webviews with different state in each.
  const disposableSerializer = vscode.window.registerWebviewPanelSerializer(WebView.type, new WebViewSerializer(vscode, context));

	context.subscriptions.push(disposableCommand, disposableSerializer);
}

// this method is called when your extension is deactivated
export function deactivate() {}
