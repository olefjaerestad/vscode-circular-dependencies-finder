import {
  drag,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  select,
  Simulation,
  zoom
} from "d3";
import { isNodeWithXandY } from "../../type-guards";
import { INode, ILink } from "../../types";

export class Drawer {
  drawGraph(nodes: INode[], links: ILink[]) {
    // https://observablehq.com/@d3/disjoint-force-directed-graph
    const svgOptions = {
      width: 100,
      height: 100,
    };
    const longestFileNameLength = nodes.sort((a,b) => b.filename.length - a.filename.length)[0]?.filename.length || 10;
    const longestSupportedFileNameLength = 200;
    const nodeRadius = 4 + (Math.min(longestFileNameLength / longestSupportedFileNameLength, 1) * 4);
    const minFontSize = .2;
    const maxFontSize = 2;
    const fontSize = Math.max(
      Math.min(nodeRadius * 2 / longestFileNameLength, maxFontSize),
      minFontSize
    );

    const simulation = forceSimulation(nodes)
      .force('link', forceLink<INode, ILink>(links).id((d) => d.id))
      .force('charge', forceManyBody())
      .force('x', forceX())
      .force('y', forceY());

    const svg = select<SVGSVGElement, INode>('svg')
      .attr('viewBox', 
        `${-svgOptions.width / 2} ${-svgOptions.height / 2} ${svgOptions.width} ${svgOptions.height}`
      )
      .style('width', '100%')
      .style('height', 'auto')
      .call(zoom<SVGSVGElement, INode>().on('zoom', function(event) {
        group.attr('transform', event.transform);
      }));

    const group = svg.append('g');

    const link = group.append('g')
      .attr('stroke', 'var(--vscode-editor-foreground)')
      .attr('stroke-width', .2)
      .selectAll('line')
      .data(links)
      .join('line');

    const node = group.append('g')
      .attr('fill', 'var(--vscode-button-background)')
      .attr('stroke', 'var(--vscode-editor-foreground)')
      .attr('stroke-width', .2)
      .selectAll<SVGCircleElement, INode>('circle')
      .data(nodes)
      .join('circle')
      .attr('r', nodeRadius)
      .call(handleDrag(simulation));

    const label = group.append('g')
      .attr('fill', 'var(--vscode-editor-foreground)')
      .attr('font-size', fontSize)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('pointer-events', 'none')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d) => d.filename);

    node.append('title')
      .text((d) => d.filename);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => isNodeWithXandY(d.source) ? d.source.x : 0)
        .attr('y1', (d) => isNodeWithXandY(d.source) ? d.source.y : 0)
        .attr('x2', (d) => isNodeWithXandY(d.target) ? d.target.x : 0)
        .attr('y2', (d) => isNodeWithXandY(d.target) ? d.target.y : 0);

      node
        .attr('cx', (d) => d.x!)
        .attr('cy', (d) => d.y!);
      
      label
        .attr('x', (d) => d.x!)
        .attr('y', (d) => d.y!);
    });

    function handleDrag(simulation: Simulation<INode, ILink>) {
      function dragStarted(event: DragEvent & {active: number}, d: any) {
        if (!event.active) {
          simulation.alphaTarget(0.1).restart();
        }

        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event: DragEvent, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragEnded(event: DragEvent & {active: number}, d: any) {
        if (!event.active) {
          simulation.alphaTarget(0);
        }

        d.fx = null;
        d.fy = null;
      }

      return drag<SVGCircleElement, INode>()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded);
    }
      
  }
}
