import {
  max,
  select,
  scaleLinear,
  interpolateRound,
  scaleBand,
  scaleSequential,
  interpolateBlues
} from 'd3';

// https://code.visualstudio.com/api/extension-guides/webview#persistence
const vscode = acquireVsCodeApi();
const prevState = vscode.getState();

function d3() {
  console.log(
    window.dependencyTree,
    dependencyTree,
    select('svg'),
    vscode,
    prevState,
  );
  vscode.setState({dependencyTree});

  const data = [
    {
      name: 'Foo',
      value: 3,
    },
    {
      name: 'Bar',
      value: 1,
    },
    {
      name: 'Baz',
      value: 5,
    },
    {
      name: 'Lorem',
      value: 2,
    },
  ];

  const svgOptions = {
    width: 100,
    height: 100,
  };

  const x = scaleLinear()
    .domain([0, max(data, (val) => val.value)!])
    .range([0, svgOptions.width])
    .interpolate(interpolateRound);
  
  const y = scaleBand()
    .domain(data.map((val) => val.name))
    .range([0, svgOptions.height])
    .padding(.1)
    .round(true);

  const color = scaleSequential()
    .domain([0, max(data, (val) => val.value)!])
    .interpolator(interpolateBlues);

  console.log(
    x(2),
    y('Foo'),
    y('Bar'),
    y('Baz'),
    y('Lorem'),
    y.bandwidth(),
    color(0),
    color(1),
    color(2),
    color(3),
    color(5),
    color(13),
  );

  select('svg')
    .attr('viewBox', `0 0 ${svgOptions.width} ${svgOptions.height}`)
    // .attr('width', 100)
    // .attr('height', 100)
    .style('width', '100%')
    .style('height', 'auto')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', (d) => y(d.name)!)
    .attr('width', (d) => x(d.value))
    .attr('height', (d) => y.bandwidth())
    .attr('fill', (d) => color(d.value));

}

d3();
