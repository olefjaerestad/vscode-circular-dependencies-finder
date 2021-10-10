import * as vscode from 'vscode';
import { join } from 'path';

interface IGetWebViewProps {
  dependencyArray: string[][];
  extensionPath: string;
  title: string;
  webview: vscode.Webview;
}

export class WebView {
  static type: 'circularDependencies' = 'circularDependencies';

  constructor(
    private vsCode: Pick<typeof vscode, 'window' | 'ViewColumn' | 'Uri'>,
    private extensionContext: Pick<vscode.ExtensionContext, 'extensionPath'>
  ) { }

  create(dependencyArray: string[][], title: string) {
    const panel = this.vsCode.window.createWebviewPanel(WebView.type, title, this.vsCode.ViewColumn.One, {
      localResourceRoots: [
        vscode.Uri.file(join(this.extensionContext.extensionPath, 'dist/webview'))
      ],
      enableScripts: true,
    });
    panel.webview.html = this.getHtml({
      dependencyArray,
      extensionPath: this.extensionContext.extensionPath,
      webview: panel.webview,
      title,
    });

    return panel;
  }

  private generateNonce() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonce = '';
    for (let i = 0; i < 32; ++i) {
      nonce += possible[Math.floor(Math.random() * possible.length)];
    }
    return nonce;
  }

  /**
   * 
   * https://content-security-policy.com/examples/allow-inline-script/
   */
  getHtml({dependencyArray, extensionPath, title, webview}: IGetWebViewProps) {
    const dependencyArrayString = JSON.stringify(dependencyArray, null, 2);
    const nonce = this.generateNonce();

    const getJsScripts = () => {
      /**
       * https://code.visualstudio.com/api/extension-guides/webview#loading-local-content
       */
      const scripts = ['dist/webview/webview.js'];
      
      return {
        links: scripts.map((relativeSrc) => (
          /*html*/`<link rel="modulepreload" href="${webview.asWebviewUri(this.vsCode.Uri.file(join(extensionPath, relativeSrc)))}">`
        )).join('\n'),
        scripts: scripts.map((relativeSrc) => (
          /*html*/`<script src="${webview.asWebviewUri(this.vsCode.Uri.file(join(extensionPath, relativeSrc)))}" type="module"></script>`
        )).join('\n'),
      };
    };

    return /*html*/`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=viewport-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${webview.cspSource} 'nonce-${nonce}';">
          <title>${title || 'Circular dependencies'}</title>
          ${getJsScripts().links}
          <script nonce="${nonce}">
            window.dependencyArray = ${dependencyArrayString};
          </script>
        </head>
        <body>
          <pre>${dependencyArrayString}</pre>
          <svg></svg>
          ${getJsScripts().scripts}
        </body>
      </html>
    `;
  }
}
