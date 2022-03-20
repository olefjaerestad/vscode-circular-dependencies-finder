import './webview.scss';
import './components/graph-component';
import './components/json-component';
import './components/tabs-component';
import { DataFormatter } from './classes/DataFormatter';
import { vscode } from './vscode-api';
import { SearchEventListeners } from './classes/SearchEventListeners';
import { MessageEventListeners } from './classes/MessageEventListeners';
import { EventListeners } from './classes/EventListeners';
import { GraphComponent } from './components/graph-component';

function init() {
  new EventListeners([SearchEventListeners, MessageEventListeners]).add();
  const dataFormatter = new DataFormatter();
  // VS Code makes dependencyArray available to us.
  const { links, nodes } = dataFormatter.dependencyArrayToGraphData(dependencyArray);

  vscode.setState({dependencyArray});
  document.querySelector<GraphComponent>('wc-graph')?.drawGraph(nodes, links, 'Found no circular dependencies');
}

init();
