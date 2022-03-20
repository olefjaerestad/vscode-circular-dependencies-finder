import * as vscode from 'vscode';
import { IState } from '../types';
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

  async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: IState) {
    new WebView(this.vsCode, this.extensionContext).createPanel(
      state.dependencyArray,
      webviewPanel.title,
      webviewPanel
    );
  }
}
