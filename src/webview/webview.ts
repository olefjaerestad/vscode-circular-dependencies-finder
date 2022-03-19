import './webview.scss';
import './components/json-component';
import './components/tabs-component';
import { DataFormatter } from './classes/DataFormatter';
import { Drawer } from './classes/Drawer';
import { vscode } from './vscode-api';
import { SearchEventListeners } from './classes/SearchEventListeners';
import { MessageEventListeners } from './classes/MessageEventListeners';
import { EventListeners } from './classes/EventListeners';

function init() {
  new EventListeners([SearchEventListeners, MessageEventListeners]).add();
  const dataFormatter = new DataFormatter();
  const drawer = new Drawer();
  // VS Code makes dependencyArray available to us.
  const { links, nodes } = dataFormatter.dependencyArrayToGraphData(dependencyArray);

  vscode.setState({dependencyArray});
  drawer.drawGraph(nodes, links, 'Found no circular dependencies');
}

init();
