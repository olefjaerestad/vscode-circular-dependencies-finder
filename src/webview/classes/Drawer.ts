import {
  drag,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  select,
  Simulation
} from "d3";
import { INode, ILink } from "../types";

export class Drawer {
  // TODO: Force all nodes to display within the SVG boundaries.
  // TODO: Fix typescript errors.
  drawGraph(nodes: INode[], links: ILink[]) {
    // https://observablehq.com/@d3/disjoint-force-directed-graph
    // TODO: Remove
    console.log(
      nodes,
      links
    );
    const svgOptions = {
      width: 100,
      height: 100,
    };

    const simulation = forceSimulation(nodes)
      // @ts-expect-error
      .force('link', forceLink(links).id((d) => d.id))
      .force('charge', forceManyBody())
      .force('x', forceX())
      .force('y', forceY());

    const svg = select('svg')
      .attr('viewBox', 
        `${-svgOptions.width / 2} ${-svgOptions.height / 2} ${svgOptions.width} ${svgOptions.height}`
      )
      .style('width', '100%')
      .style('height', 'auto');

    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(2));

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('fill', 'red')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 1)
      // @ts-expect-error
      .call(handleDrag(simulation));

    node.append('title')
      .text((d) => d.filename);

    simulation.on('tick', () => {
      link
        // @ts-expect-error
        .attr('x1', d => d.source.x)
        // @ts-expect-error
        .attr('y1', d => d.source.y)
        // @ts-expect-error
        .attr('x2', d => d.target.x)
        // @ts-expect-error
        .attr('y2', d => d.target.y);

      node
        .attr('cx', (d) => d.x!)
        .attr('cy', (d) => d.y!);
        // .attr('cx', (d) => Math.max(-50, Math.min(50, d.x!)))
        // .attr('cy', (d) => Math.max(-50, Math.min(50, d.y!)));
    });

    function handleDrag(simulation: Simulation<INode, ILink>) {
      function dragStarted(event: DragEvent, d: any) {
        console.log({event, d});
        // @ts-expect-error
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

      function dragEnded(event: DragEvent, d: any) {
        // @ts-expect-error
        if (!event.active) {
          simulation.alphaTarget(0);
        }

        d.fx = null;
        d.fy = null;
      }

      return drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded);
    }
      
  }
}
