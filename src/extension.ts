// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as madge from 'madge';
import path = require('path');
// import { d3 } from './client/d3';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "vscode-circular-dependencies-finder" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-circular-dependencies-finder.find', () => {
		// The code you place here will be executed every time your command is executed
    try {
      // console.log('[Circular dependencies] Analyzing...');
      vscode.window.showInformationMessage('[Circular dependencies] Analyzing dependency tree...');
      
      // @ts-ignore
      madge(resolve(join(dirname(fileURLToPath(import.meta.url))), 'mock/index.ts')).then((deps) => {
        // console.log('[Circular dependencies] Finished analyzing.');
        console.log(deps.circular());
        // Display a message box to the user
		    vscode.window.showInformationMessage('[Circular dependencies] Finished analyzing.');
        const panel = vscode.window.createWebviewPanel('circularDependencies', 'Circular dependencies', vscode.ViewColumn.One, {
          // localResourceRoots: [
          //   vscode.Uri.file(path.join(context.extensionPath, 'src'))
          // ],
          enableScripts: true,
        });
        panel.webview.html = getWebviewHtml({
          dependencies: deps.circular(),
          extensionPath: context.extensionPath,
          webview: panel.webview,
        });
      });
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
  dependencies: string[][],
  extensionPath: string,
  webview: vscode.Webview,
}
function getWebviewHtml({dependencies, extensionPath, webview}: IGetWebViewProps) {
  let markup = /*html*/`<p>No circular dependencies, hooray!</p>`;
  if (dependencies.length) {
    markup = JSON.stringify(dependencies, null, 2);
  }

  function getJsScripts() {
    /**
     * https://code.visualstudio.com/api/extension-guides/webview#loading-local-content
     */
    return ['src/client/d3.js'].map((relativeSrc) => (
      /*html*/`<script src="${webview.asWebviewUri(vscode.Uri.file(path.join(extensionPath, relativeSrc)))}" type="module"></script>`
    )).join('\n');
  }

  return /*html*/`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=viewport-width, initial-scale=1.0">
        <!--<meta http-equiv="Content-Security-Policy" content="default-src">-->
        <title>Circular dependencies</title>
      </head>
      <body>
        <pre>${markup}</pre>
        ${getJsScripts()}
      </body>
    </html>
  `;
}


// webpack({
//   // entry: './mock/index.ts',
//   // entry: '../mock/index.ts',
//   // entry: 'mock/index.ts',
//   entry: resolve(join(__dirname, '../mock/index.ts')),
//   output: {
//     filename: 'output.js',
//     path: __dirname
//   },
//   // resolve: {
//   //   extensions: ['.ts'],
//   // },
//   // module: {
//   //   rules: [{
//   //     test: /\.ts$/,
//   //     loader: 'ts-loader',
//   //     exclude: /node_modules/,
//   //   }]
//   // }
// }, (err, stats) => {
//   console.log(
//     // err,
//     stats?.toJson()
//   );
//   if (err || stats?.hasErrors()) {
//     console.error('[Circular dependencies] Something went wrong while analyzing.');
//   }
// });
// @ts-ignore
// import('./mock/index').then((mod) => console.log(mod));
// console.log('path', resolve(join(dirname(fileURLToPath(import.meta.url))), 'mock/index'));
