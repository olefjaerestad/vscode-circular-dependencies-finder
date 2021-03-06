import { IGraphData, ILink, TDependencyArray, TNodeArray } from "../../types";

export class DataFormatter {
  dependencyArrayToGraphData(deps: TDependencyArray): IGraphData {
    const nodeTree = this.dependencyArrayToNodeTree(deps);
    
    return {
      links: this.nodeTreeToLinks(nodeTree),
      nodes: nodeTree.flat(),
    };
  }

  private dependencyArrayToNodeTree(deps: TDependencyArray): TNodeArray {
    return deps.map((subtree, i) => {
      return subtree.map((dep, j) => ({
        filepath: dep,
        id: `${i}-${j}`
      }));
    });
  }
  
  private nodeTreeToLinks(tree: TNodeArray): ILink[] {
    const links: ILink[] = [];
    tree.forEach((subtree) => {
      subtree.forEach((dependency, i, tree) => {
        links.push({
          source: dependency.id,
          target: tree[i+1]?.id || tree[0]?.id,
        });
      });
    });
    return links;
  }
}
