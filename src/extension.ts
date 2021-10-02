// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as madge from 'madge';
import path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "vscode-circular-dependencies-finder" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-circular-dependencies-finder.find', async () => {
		// The code you place here will be executed every time your command is executed
    try {
      const files = await vscode.workspace.findFiles(
        '**/*.{js,ts,jsx,tsx}',
        'node_modules'
      );
      console.log(files);
      const file = await vscode.window.showQuickPick(
        files.map((file) => file.fsPath.split(vscode.workspace.name || '')[1]),
        {
          canPickMany: false,
          title: 'Find circular dependencies: select starting file',
          placeHolder: '/path/to/file.ts',
        }
      );
      console.log({file});

      if (!file) {
        return;
      }
      // vscode.window.showQuickPick(['Foo', 'bar']).then((value) => console.log(value));
      // console.log(await vscode.workspace.findFiles('**/*.ts'));
      // const opened = await vscode.window.showOpenDialog();
      // console.log(opened);
      // const opened2 = await vscode.window.showWorkspaceFolderPick();
      // console.log(opened2);
      // console.log('[Circular dependencies] Analyzing...');
      // vscode.window.showInformationMessage('[Circular dependencies] Analyzing dependency tree...');
      const dependencyTree = await vscode.window.withProgress({
        // location: {viewId: 'editor'}
        location: vscode.ProgressLocation.Notification,
        title: '[Circular dependencies] Analyzing dependency tree...',
        cancellable: true,
      }, (progress, token) => {
        console.log('waiting....');
        console.log(progress, token);
        // @ts-ignore
        return madge(resolve(join(dirname(fileURLToPath(import.meta.url))), 'mock/index.ts'));
        // return new Promise<string>((resolve, reject) => {
        //   setTimeout(() => {
        //     console.log('resolve');
        //     resolve('hallo');
        //   }, 5000);
        // });
      });

      // console.log({dependencyTree: dependencyTree.circular()});

      const panel = vscode.window.createWebviewPanel('circularDependencies', 'Circular dependencies', vscode.ViewColumn.One, {
        // localResourceRoots: [
        //   vscode.Uri.file(path.join(context.extensionPath, 'src'))
        // ],
        enableScripts: true,
      });
      panel.webview.html = getWebviewHtml({
        dependencyTree: dependencyTree.circular(),
        extensionPath: context.extensionPath,
        webview: panel.webview,
      });
      
      // @ts-ignore
      // madge(resolve(join(dirname(fileURLToPath(import.meta.url))), 'mock/index.ts')).then((deps) => {
      //   // console.log('[Circular dependencies] Finished analyzing.');
      //   console.log(deps.circular());
      //   // Display a message box to the user
		  //   vscode.window.showInformationMessage('[Circular dependencies] Finished analyzing.');
      //   const panel = vscode.window.createWebviewPanel('circularDependencies', 'Circular dependencies', vscode.ViewColumn.One, {
      //     // localResourceRoots: [
      //     //   vscode.Uri.file(path.join(context.extensionPath, 'src'))
      //     // ],
      //     enableScripts: true,
      //   });
      //   panel.webview.html = getWebviewHtml({
      //     dependencies: deps.circular(),
      //     extensionPath: context.extensionPath,
      //     webview: panel.webview,
      //   });
      // });
    } catch(error) {
      // console.error('[Circular dependencies] error:', error);
      vscode.window.showErrorMessage(`[Circular dependencies] error: ${error}`);
    }
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

interface IGetWebViewProps {
  dependencyTree: string[][],
  extensionPath: string,
  webview: vscode.Webview,
}
/**
 * 
 * https://content-security-policy.com/examples/allow-inline-script/
 */
function getWebviewHtml({dependencyTree, extensionPath, webview}: IGetWebViewProps) {
  // let markup = /*html*/`<p>No circular dependencies, hooray!</p>`;
  // if (dependencyTree.length) {
  const dependencyTreeString = JSON.stringify(dependencyTree, null, 2);
  // }
  const nonce = generateNonce();

  function getJsScripts() {
    /**
     * https://code.visualstudio.com/api/extension-guides/webview#loading-local-content
     */
    return ['dist/webview/webview.js'].map((relativeSrc) => (
      /*html*/`<script src="${webview.asWebviewUri(vscode.Uri.file(path.join(extensionPath, relativeSrc)))}" type="module"></script>`
    )).join('\n');
  }

  return /*html*/`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=viewport-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${webview.cspSource} 'nonce-${nonce}';">
        <title>Circular dependencies</title>
        <script nonce="${nonce}">
          window.dependencyTree = ${dependencyTreeString};
        </script>
      </head>
      <body>
        <pre>${dependencyTreeString}</pre>
        ${getJsScripts()}
      </body>
    </html>
  `;
}

function generateNonce() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < 32; ++i) {
    nonce += possible[Math.floor(Math.random() * possible.length)];
  }
  return nonce;
}
