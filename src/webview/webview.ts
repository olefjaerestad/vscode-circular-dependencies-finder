import { select } from 'd3';

function d3() {
  console.log(
    window.dependencyTree,
    dependencyTree,
    select('pre')
  );
  return /*html*/`<p>Markup returned by d3</p>`;
}

d3();
