import * as vscode from 'vscode';

export class FilePicker {
  constructor(
    private window: Pick<typeof vscode.window, 'showQuickPick'>, 
    private workspace: Pick<typeof vscode.workspace, 'findFiles' | 'name'>
  ) { }

  async pick() {
    const files = await this.workspace.findFiles(
      '**/*.{js,ts,jsx,tsx}',
      'node_modules'
    );
    const file = await this.window.showQuickPick(
      files.map((file) => ({
        label: file.fsPath.split('/').reverse()[0],
        description: file.fsPath.split(this.workspace.name || '')[1]
          .replace('/', '')
          .replace(/\/.[^\/]*$/, ''),
      } as vscode.QuickPickItem)),
      {
        title: 'Find circular dependencies: select starting file',
        placeHolder: '/path/to/file.ts',
      }
    );

    const sanitizedFile = file ? encodeURI(`${file.description}/${file.label}`) : null;

    return sanitizedFile;
  }
}
