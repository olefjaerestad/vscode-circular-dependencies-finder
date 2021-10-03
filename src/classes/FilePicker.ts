import * as vscode from 'vscode';

export class FilePicker {
  constructor(
    private window: typeof vscode.window, 
    private workspace: typeof vscode.workspace
  ) { }

  async pick() {
    const files = await this.workspace.findFiles(
      '**/*.{js,ts,jsx,tsx}',
      'node_modules'
    );
    const file = await this.window.showQuickPick(
      files.map((file) => file.fsPath.split(this.workspace.name || '')[1]),
      {
        canPickMany: false,
        title: 'Find circular dependencies: select starting file',
        placeHolder: '/path/to/file.ts',
      }
    );

    const sanitizedFile = file ? encodeURI(file) : null;

    return sanitizedFile;
  }
}
