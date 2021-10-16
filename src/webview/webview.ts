import { DataFormatter } from './classes/DataFormatter';
import { Drawer } from './classes/Drawer';

// https://code.visualstudio.com/api/extension-guides/webview#persistence
const vscode = acquireVsCodeApi();

function init() {
  const dataFormatter = new DataFormatter();
  const drawer = new Drawer();
  // VS Code makes dependencyArray available to us.
  const { links, nodes } = dataFormatter.dependencyArrayToGraphData(dependencyArray);

  vscode.setState({dependencyArray});
  drawer.drawGraph(nodes, links);
}

init();
