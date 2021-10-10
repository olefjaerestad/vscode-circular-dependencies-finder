type IFileId = string;

export interface INode {
  filename: string;
  id: IFileId;
}

export type TDependencyArray = string[][];

export type TNodeArray = INode[][];

export interface ILink {
  source: IFileId;
  target: IFileId;
}

export interface IChartData {
  links: ILink[];
  nodes: INode[];
}
