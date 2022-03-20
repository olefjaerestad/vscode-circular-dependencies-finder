import { SimulationNodeDatum, SimulationLinkDatum } from "d3";

type TFileId = string;

export type TJsonData = string;

export interface INode extends SimulationNodeDatum {
  filename: string;
  id: TFileId;
}

export type TDependencyArray = string[][];

export type TNodeArray = INode[][];

export interface ILink extends SimulationLinkDatum<INode> {
  source: TFileId | INode;
  target: TFileId | INode;
}

export interface IGraphData {
  links: ILink[];
  nodes: INode[];
}

export interface IMessageEventPayload<D = any> {
  type: 'initSearch' | 'search';
  data?: D;
}

export interface IState {
  dependencyArray: TDependencyArray;
  search?: string;
}
