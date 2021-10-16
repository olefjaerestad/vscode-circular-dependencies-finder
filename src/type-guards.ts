import { INode } from "./types";

export function isNodeWithXandY(node: any): node is INode & {x: NonNullable<INode['x']>; y: NonNullable<INode['y']>} {
  return typeof node === 'object' && 'x' in node && 'y' in node;
}
