export function a() {
  import('./b').then((module) => {
    console.info('a() calls b', module.b());
  });
}
