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

    const getScriptsAndStyles = () => {
      /**
       * https://code.visualstudio.com/api/extension-guides/webview#loading-local-content
       */
      const scripts = ['dist/webview/webview.js'];
      const styles = ['dist/webview/webview.css'];
      
      return {
        links: [
          ...scripts.map((relativeSrc) => (
            /*html*/`<link rel="modulepreload" href="${webview.asWebviewUri(this.vsCode.Uri.file(join(extensionPath, relativeSrc)))}" as="script" type="application/javascript">`
          )),
          ...styles.map((relativeSrc) => (
            /*html*/`<link rel="preload" href="${webview.asWebviewUri(this.vsCode.Uri.file(join(extensionPath, relativeSrc)))}" as="style" type="text/css">`
          ))
        ].join('\n'),
        scripts: scripts.map((relativeSrc) => (
          /*html*/`<script src="${webview.asWebviewUri(this.vsCode.Uri.file(join(extensionPath, relativeSrc)))}" type="module"></script>`
        )).join('\n'),
        styles: styles.map((relativeSrc) => (
          /*html*/`<link rel="stylesheet" href="${webview.asWebviewUri(this.vsCode.Uri.file(join(extensionPath, relativeSrc)))}">`
        )).join('\n'),
      };
    };

    const scriptsAndStyles = getScriptsAndStyles();

    return /*html*/`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=viewport-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${webview.cspSource} 'nonce-${nonce}'; style-src ${webview.cspSource};">
          <title>${title || 'Circular dependencies'}</title>
          ${scriptsAndStyles.links}
          ${scriptsAndStyles.styles}
          <script nonce="${nonce}">
            window.dependencyArray = ${dependencyArrayString};
          </script>
        </head>
        <body>
          <wc-tabs>
            <nav data-role="tabs" id="tabs">
              <button type="button" data-for="panel-graph">Graph view</button>
              <button type="button" data-for="panel-json">JSON view</button>
            </nav>
            <section data-role="panels">
              <svg data-id="panel-graph"></svg>
              <pre data-id="panel-json">${dependencyArrayString}</pre>
            </section>
          </wc-tabs>
          ${scriptsAndStyles.scripts}
        </body>
      </html>
    `;
  }
}
