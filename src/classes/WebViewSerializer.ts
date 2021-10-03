import * as vscode from 'vscode';
import { WebView } from './WebView';

/**
 * Helps automatically restoring webview(s) when restarting VS Code.
 * https://code.visualstudio.com/api/extension-guides/webview#serialization
 */
export class WebViewSerializer implements vscode.WebviewPanelSerializer {
  constructor(
    private vsCode: Pick<typeof vscode, 'window' | 'ViewColumn' | 'Uri'>,
    private extensionContext: Pick<vscode.ExtensionContext, 'extensionPath'>
  ) { }

  async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: Record<string, any>) {
    webviewPanel.webview.html = new WebView(this.vsCode, this.extensionContext).getHtml({
      extensionPath: this.extensionContext.extensionPath,
      webview: webviewPanel.webview,
      dependencyTree: state.dependencyTree
    });
  }
}
