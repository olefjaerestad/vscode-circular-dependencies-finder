import * as vscode from 'vscode';
import { join } from 'path';

interface IGetWebViewProps {
  dependencyTree: string[][],
  extensionPath: string,
  webview: vscode.Webview,
}

export class WebView {
  constructor(
    private vsCode: Pick<typeof vscode, 'window' | 'ViewColumn' | 'Uri'>,
    private extensionContext: Pick<vscode.ExtensionContext, 'extensionPath'>
  ) { }

  create(dependencyTree: string[][]) {
    const panel = this.vsCode.window.createWebviewPanel('circularDependencies', 'Circular dependencies', this.vsCode.ViewColumn.One, {
      localResourceRoots: [
        vscode.Uri.file(join(this.extensionContext.extensionPath, 'dist/webview'))
      ],
      enableScripts: true,
    });
    panel.webview.html = this.getHtml({
      dependencyTree,
      extensionPath: this.extensionContext.extensionPath,
      webview: panel.webview,
    });
  }

  /**
   * 
   * https://content-security-policy.com/examples/allow-inline-script/
   */
  private getHtml({dependencyTree, extensionPath, webview}: IGetWebViewProps) {
    const dependencyTreeString = JSON.stringify(dependencyTree, null, 2);
    const nonce = this.generateNonce();

    const getJsScripts = () => {
      /**
       * https://code.visualstudio.com/api/extension-guides/webview#loading-local-content
       */
      return ['dist/webview/webview.js'].map((relativeSrc) => (
        /*html*/`<script src="${webview.asWebviewUri(this.vsCode.Uri.file(join(extensionPath, relativeSrc)))}" type="module"></script>`
      )).join('\n');
    };

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

  private generateNonce() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonce = '';
    for (let i = 0; i < 32; ++i) {
      nonce += possible[Math.floor(Math.random() * possible.length)];
    }
    return nonce;
  }
}
