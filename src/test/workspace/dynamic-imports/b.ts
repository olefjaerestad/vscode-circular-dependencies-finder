export function b() {
  import('./a').then((module) => {
    console.info('b() calls a', module.a());
  });
}
