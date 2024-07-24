import * as assert from 'assert';
import * as vscode from 'vscode';
import { DependencyFinder } from '../../classes/DependencyFinder';

const dependencyFinder = new DependencyFinder(vscode.window, vscode.ProgressLocation);
const fileExtensionsToTest = ['css', 'less', 'scss', 'ts', 'js'];

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

  suite('DependencyFinder.findCircular() should return an array of circular dependencies', () => {
    fileExtensionsToTest.forEach((ext) => {
      test(
      `for a given .${ext} file`, 
      async () => {
        const filePath = vscode.workspace.workspaceFolders?.[0].uri.path 
          ? vscode.workspace.workspaceFolders?.[0].uri.path + `/index.${ext}`
          : null;

        if (!filePath) {
          assert.fail(`No index.${ext} file found. Did you forget to load a workspace?`);
        }
        
        const circularDependencies = await dependencyFinder.findCircular(filePath);

        assert.deepStrictEqual(circularDependencies, [
          [
            `a/a.${ext}`,
            `b/b.${ext}`,
          ],
          [
            `e/e.${ext}`,
            `f/f.${ext}`,
            `d/d.${ext}`,
          ],
        ]);
      });
    });
  });

  suite('Issue #13: DependencyFinder.findCircular() should support file paths with special characters', () => {
    const folders = ['@folder-name', '(.)folder-name', '[folder-name]', '[...folder-name]', '[[...folder-name]]', '_folder-name'];

    folders.forEach((folder) => {
      test(folder, async () => {
        const filePath = vscode.workspace.workspaceFolders?.[0].uri.path 
          ? vscode.workspace.workspaceFolders?.[0].uri.path + `/special-file-path-characters/${folder}/index.ts`
          : null;
  
        if (!filePath) {
          assert.fail(`No /special-file-path-characters/${folder}/index.ts file found. Did you forget to load a workspace?`);
        }
        
        const circularDependencies = await dependencyFinder.findCircular(filePath);
  
        assert.deepStrictEqual(circularDependencies, [
          [
            '../../a/a.ts',
            '../../b/b.ts',
          ],
        ]);
      });
    });
  });

  suite('Issue #16: DependencyFinder.findCircular() should be able to include and exclude `import type` statements', () => {
      test('include `import type` statements', async () => {
        const filePath = vscode.workspace.workspaceFolders?.[0].uri.path 
          ? vscode.workspace.workspaceFolders?.[0].uri.path + `/types/types-a.ts`
          : null;

        if (!filePath) {
          assert.fail('No /types/types-a.ts file found. Did you forget to load a workspace?');
        }
        
        const circularDependencies = await dependencyFinder.findCircular(filePath);
        
        assert.deepStrictEqual(circularDependencies, [[
          'types-a.ts',
          'types-b.ts',
          'types-c.ts',
        ]]);
      });

      test('exclude `import type` statements', async () => {
        const filePath = vscode.workspace.workspaceFolders?.[0].uri.path 
          ? vscode.workspace.workspaceFolders?.[0].uri.path + `/types/types-a.ts`
          : null;

        if (!filePath) {
          assert.fail('No /types/types-a.ts file found. Did you forget to load a workspace?');
        }
        
        const circularDependencies = await dependencyFinder.findCircular(filePath, {
          excludeTypeImports: true,
        });
        
        assert.deepStrictEqual(circularDependencies, []);
      });
    });
});
