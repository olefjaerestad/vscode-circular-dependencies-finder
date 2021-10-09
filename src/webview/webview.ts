import {
  max,
  select,
  scaleLinear,
  interpolateRound,
  scaleBand,
  scaleSequential,
  interpolateBlues,
  line as d3line,
  scaleUtc,
  extent,
  curveCatmullRom,
  area as d3area,
  arc as d3arc,
  sum,
  interpolateRainbow,
  pie,
  PieArcDatum,
  easeLinear,
  interpolate
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
      date: '2021-10-08',
      name: 'Foo',
      value: 3,
    },
    {
      date: '2021-10-09',
      name: 'Bar',
      value: 1,
    },
    {
      date: '2021-10-10',
      name: 'Baz',
      value: 5,
    },
    {
      date: '2021-10-11',
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

  const x2 = scaleUtc()
    .domain(extent<typeof data[0], Date>(data, (d) => new Date(d.date)) as [Date, Date])
    .range([0, svgOptions.width]);
  
  const y2 = scaleLinear()
    .domain([0, max(data, (d) => d.value)!])
    .range([svgOptions.height, 0]);

  const line = d3line<typeof data[0]>()
    .x((d) => x2(new Date(d.date)))
    .y((d) => y2(d.value))
    .curve(curveCatmullRom.alpha(.5));

  const area = d3area<typeof data[0]>()
    .x((d) => x2(new Date(d.date)))
    .y0(y2(0))
    .y1((d) => y2(d.value));

  const arc = d3arc<[number, number]>()
    .innerRadius(svgOptions.width / 4)
    .outerRadius(svgOptions.width / 2)
    .startAngle(([startAngle, endAngle]) => startAngle)
    .endAngle(([startAngle, endAngle]) => endAngle);

  const pieArcData = pie<typeof data[0]>()
    .value((d) => d.value)(data);

  const arcPie = d3arc<void, PieArcDatum<typeof data[0]>>()
    .innerRadius(svgOptions.width / 4)
    .outerRadius(svgOptions.width / 2)
    .padRadius(300)
    .padAngle(2 / 300)
    .cornerRadius(4);

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
    line(data),
    area(data),
    area.y1,
    '---',
    area.lineY1()(data),
    arc([Math.PI, Math.PI / 2]),
    pieArcData
  );

  // bar chart
  select('svg')
    .attr('viewBox', `0 0 ${svgOptions.width} ${svgOptions.height}`)
    // .attr('width', 100)
    // .attr('height', 100)
    .style('width', '100%')
    .style('height', 'auto')
    .selectAll('rect.bar')
    .data(data)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('x', 0)
    .attr('y', (d) => y(d.name)!)
    .attr('width', (d) => x(d.value))
    .attr('height', (d) => y.bandwidth())
    .attr('fill', (d) => color(d.value));

  // area chart
  select('svg')
    .append('path')
    .attr('d', area(data))
    .attr('fill', '#f07');

  // line chart
  select('svg')
    .append('path')
    .attr('d', line(data))
    .attr('fill', 'none')
    .attr('stroke', '#f70')
    .attr('opacity', '.5');

  // line chart
  select('svg')
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', '#7f0')
    .attr('opacity', '.5')
    .attr('d', area.lineY1()(data))
    .transition()
    .duration(5000)
    .ease(easeLinear)
    .attrTween('stroke-dasharray', function() {
      const length = this.getTotalLength();
      return interpolate(`0, ${length}`, `${length}, ${length}`);
    });

  // Manual arc
  // select('svg')
  //   .append('path')
  //   .attr('fill', 'none')
  //   .attr('stroke', '#0f7')
  //   .attr('transform', 'translate(30,60)')
  //   .attr('d', arc([0, Math.PI])); // Math.PI = half circle.

  let currentArcEnd = 0;

  // Manual arcs
  select('svg')
    .selectAll('path.arc')
    .data(data)
    .enter()
    .append('path')
    .classed('arc', true)
    .attr('fill', (d, i, a) => interpolateRainbow(i / a.length - 1))
    .attr('stroke', '#0f7')
    .attr('transform', 'translate(30,55)')
    .attr('d', (d, i, e) => {
      const end = (d.value / sum(data, (d) => d.value)) * (Math.PI * 2);
      return arc([
        currentArcEnd,
        currentArcEnd += end
      ]);
    });

  // Automatic arcs
  select('svg')
    .selectAll('path.arc2')
    .data(pieArcData)
    .enter()
    .append('path')
    .classed('arc2', true)
    .attr('transform', 'translate(30,55)')
    .attr('d', (d) => arcPie(d));
}

d3();
