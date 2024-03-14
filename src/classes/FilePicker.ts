import * as vscode from 'vscode';

export class FilePicker {
  constructor(
    private window: Pick<typeof vscode.window, 'showQuickPick'>, 
    private workspace: Pick<typeof vscode.workspace, 'findFiles' | 'name' | 'asRelativePath' | 'workspaceFolders'>
  ) { }

  async pick() {
    const files = await this.workspace.findFiles(
      '**/*.{js,jsx,ts,tsx,css,scss,less}',
      'node_modules'
    );
    const file = await this.window.showQuickPick(
      files.map((file) => ({
        label: file.fsPath.split('/').reverse()[0],
        // description: this.workspace.asRelativePath(file.fsPath).replace(/\/.[^\/]*$/, ''),
        description: this.workspace.asRelativePath(file.fsPath),
      } as vscode.QuickPickItem)),
      {
        title: 'Find Circular Dependencies: Select Starting File',
        placeHolder: '/path/to/file.ts',
        matchOnDescription: true,
      }
    );

    const sanitizedFilePath = file 
      ? `${this.workspace.workspaceFolders?.[0].uri.path || ''}/${file.description}` 
      : null;

    return sanitizedFilePath;
  }
}
