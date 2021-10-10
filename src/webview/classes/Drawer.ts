import { INode, ILink } from "../types";

export class Drawer {
  // TODO:
  drawGraph(nodes: INode[], links: ILink[]) {
    console.log(
      nodes,
      links
    );
    const svgOptions = {
      width: 100,
      height: 100,
    };
  }
}
