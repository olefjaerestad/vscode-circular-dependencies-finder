import * as vscode from 'vscode';
import { when } from '../utils/control-flow-utils/when';

type QuickPickItem<AdditionalProperties extends Record<PropertyKey, any> = {}> = 
  vscode.QuickPickItem & AdditionalProperties;

export class FilePicker {
  constructor(
    private window: Pick<typeof vscode.window, 'showQuickPick'>, 
    private workspace: Pick<typeof vscode.workspace, 'findFiles' | 'name' | 'asRelativePath' | 'workspaceFolders'>
  ) { }

  async pick() {
    const method = await this.window.showQuickPick([
      { label: 'In current file', value: 'IN_CURRENT_FILE' }, 
      { label: 'Select file...', value: 'IN_SELECTED_FILE' },
    ] as QuickPickItem<{value: 'IN_CURRENT_FILE' | 'IN_SELECTED_FILE'}>[]);

    const filePath = await when(
      [method?.value === 'IN_CURRENT_FILE', () => {
        return vscode.window.activeTextEditor?.document.fileName;
      }],
      [method?.value === 'IN_SELECTED_FILE', async () => {
        const files = await this.workspace.findFiles(
          '**/*.{js,jsx,ts,tsx,css,scss,less}',
          'node_modules'
        );
        const file = await this.window.showQuickPick(
          files.map((file) => ({
            label: file.fsPath.split('/').reverse()[0],
            description: this.workspace.asRelativePath(file.fsPath),
            path: file.fsPath,
          } as QuickPickItem<{path: string}>)),
          {
            title: 'Find Circular Dependencies: Select Starting File',
            placeHolder: '/path/to/file.ts',
            matchOnDescription: true,
          }
        );

        return file?.path;
      }],
    );

    return filePath; 
  }
}
