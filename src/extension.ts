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
      const filePath = await new FilePicker(vscode.window, vscode.workspace).pick();
      if (!filePath) {
        return;
      }

      const circularDependencies = await new DependencyFinder(vscode.window, vscode.ProgressLocation)
        .findCircular(
          filePath
        );

      new WebView(vscode, context).create(
        circularDependencies,
        `Circular Dependencies: ${filePath.split('/').reverse()[0]}`
      );
    } catch(error) {
      vscode.window.setStatusBarMessage(`[Circular Dependencies] ${error}`, 5000);
    }
	});

  const disposableSerializer = vscode.window.registerWebviewPanelSerializer(WebView.type, new WebViewSerializer(vscode, context));

	context.subscriptions.push(disposableCommand, disposableSerializer);
}

// this method is called when your extension is deactivated
export function deactivate() {}
