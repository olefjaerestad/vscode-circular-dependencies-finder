import * as vscode from 'vscode';
import { join } from 'path';
import { IMessageEventPayload } from '../types';

interface IGetWebViewProps {
  dependencyArray: string[][];
  extensionPath: string;
  title: string;
  webview: vscode.Webview;
}

export class WebView {
  static type = 'circularDependencies' as const;

  constructor(
    private vsCode: Pick<typeof vscode, 'window' | 'ViewColumn' | 'Uri'>,
    private extensionContext: Pick<vscode.ExtensionContext, 'extensionPath'>
  ) { }

  createPanel(dependencyArray: string[][], title: string, addTo?: vscode.WebviewPanel) {
    const panel = addTo || this.vsCode.window.createWebviewPanel(WebView.type, title, this.vsCode.ViewColumn.One, {
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

    panel.webview.onDidReceiveMessage(async (message: IMessageEventPayload) => {
      switch(message.type) {
        case 'initSearch': {
          const searchQuery = await this.vsCode.window.showInputBox({
            title: 'Find filename in circular dependencies',
            placeHolder: 'Find',
          });
          panel.webview.postMessage({
            type: 'search', 
            data: searchQuery,
          } as IMessageEventPayload);
        }
        default: {
          return;
        }
      }
    });

    return panel;
  }

  private static generateNonce() {
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
    const nonce = WebView.generateNonce();

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
          <title>${title || 'Circular Dependencies'}</title>
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
              <wc-graph data-id="panel-graph"></wc-graph>
              <wc-json data-id="panel-json" json='${dependencyArrayString}'></wc-json>
            </section>
          </wc-tabs>
          ${scriptsAndStyles.scripts}
        </body>
      </html>
    `;
  }
}
