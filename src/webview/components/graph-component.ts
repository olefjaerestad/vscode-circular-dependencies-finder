import styles from './graph-component.scss';
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
import { INode, ILink, IMessageEventPayload } from "../../types";
import { filename } from '../../utils/string-utils';

let instanceCount = 0;

export class GraphComponent extends HTMLElement {
	dataId!: string;

	constructor() {
		super();
		
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.dataId = (instanceCount++).toString();

		this.append(svg);
		this.setAttribute('data-graph-id', this.dataId);

		this.handleMessage = this.handleMessage.bind(this);
	}

	connectedCallback() {
		window.addEventListener('message', this.handleMessage);
	}
	
	disconnectedCallback() {
		window.removeEventListener('message', this.handleMessage);
	}

	drawGraph(nodes: INode[], links: ILink[], nodesEmptyMsg?: string) {
    // https://observablehq.com/@d3/disjoint-force-directed-graph
    const tabsHeight = document.getElementById('tabs')?.getBoundingClientRect().height;
    const svgOptions = {
      width: 100,
      height: (window.innerHeight - (tabsHeight || 0)) / window.innerWidth * 100,
    };
    const longestFileNameLength = nodes.length 
      ? filename(
          nodes.sort(
            (a,b) => filename(b.filepath).length - filename(a.filepath).length
          )[0].filepath
        ).length
      : 10;
    const longestSupportedFileNameLength = 100;
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

    const svg = select<SVGSVGElement, INode>(`wc-graph[data-graph-id="${this.dataId}"] svg`)
      .attr('viewBox', 
        `${-svgOptions.width / 2} ${-svgOptions.height / 2} ${svgOptions.width} ${svgOptions.height}`
      )
      .style('width', '100%')
      .style('height', 'auto')
      .style('display', 'block') // Fill available space.
      .call(zoom<SVGSVGElement, INode>().on('zoom', function(event) {
        group.attr('transform', event.transform);
      }));

    const group = svg.append('g');

    if (!nodes.length) {
      nodesEmptyMsg && group
        .append('text')
        .attr('fill', 'var(--vscode-editor-foreground)')
        .attr('font-size', 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(nodesEmptyMsg);

      return;
    }

    const link = group.append('g')
      .attr('stroke', 'var(--vscode-editor-foreground)')
      .attr('stroke-width', .2)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('marker-end', 'url(#arrow)');

    // https://stackoverflow.com/a/36965964
    // https://jsfiddle.net/4xt5v51m/3/
    const arrow = group.append('defs')
      .selectAll('marker')
      .data(['placeholderData'])
      .join('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 5 10')
      .attr('refX', nodeRadius * 8) // Magic number that places arrow outside of node.
      .attr('refY', 5)
      .attr('markerWidth', 5)
      .attr('markerHeight', 10)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,0 L5,5 L0,10')
      .attr('fill', 'var(--vscode-editor-foreground)');

    const node = group.append('g')
      .attr('fill', 'var(--vscode-editor-background)')
      .attr('stroke', 'var(--vscode-editor-foreground)')
      .attr('stroke-width', .2)
      .selectAll<SVGCircleElement, INode>('circle')
      .data(nodes)
      .join('circle')
      .attr('data-value', (d) => d.filepath)
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
      .text((d) => filename(d.filepath));

    node.append('title')
      .text((d) => d.filepath);

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

	private handleMessage(event: MessageEvent<IMessageEventPayload<string>>) {
		switch(event.data.type) {
			case 'search': {
				this.search(event.data.data || '');
			}
			default: {
				return;
			}
		}
	}

	private search(query: string) {
		const queryLowerCase = query.toLocaleLowerCase();

		this.querySelectorAll('circle').forEach((el) => {
			el.classList.remove(styles.highlight);

			if (queryLowerCase && el.getAttribute('data-value')?.toLocaleLowerCase().includes(queryLowerCase)) {
				el.classList.add(styles.highlight);
			}
		});
	}
}

!customElements.get('wc-graph') && customElements.define('wc-graph', GraphComponent);
