import { select } from 'd3';

// https://code.visualstudio.com/api/extension-guides/webview#persistence
const vscode = acquireVsCodeApi();
const prevState = vscode.getState();

function d3() {
  console.log(
    window.dependencyTree,
    dependencyTree,
    select('pre'),
    vscode,
    prevState,
  );
  vscode.setState({dependencyTree});
  return /*html*/`<p>Markup returned by d3</p>`;
}

d3();
