import { SimulationNodeDatum, SimulationLinkDatum } from "d3";

type IFileId = string;

export interface INode extends SimulationNodeDatum {
  filename: string;
  id: IFileId;
}

export type TDependencyArray = string[][];

export type TNodeArray = INode[][];

export interface ILink extends SimulationLinkDatum<INode> {
  source: IFileId | INode;
  target: IFileId | INode;
}

export interface IGraphData {
  links: ILink[];
  nodes: INode[];
}
