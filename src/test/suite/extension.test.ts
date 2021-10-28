import * as assert from 'assert';
import * as vscode from 'vscode';
import { DependencyFinder } from '../../classes/DependencyFinder';

const dependencyFinder = new DependencyFinder(vscode.window, vscode.ProgressLocation);
const fileExtensionsToTest = ['css', 'less', 'scss', 'ts'];

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

        assert.ok(JSON.stringify(circularDependencies) === JSON.stringify([
          [
            `a/a.${ext}`,
            `b/b.${ext}`,
          ],
          [
            `e/e.${ext}`,
            `f/f.${ext}`,
            `d/d.${ext}`,
          ],
        ]));
      });
    });
  });
});
