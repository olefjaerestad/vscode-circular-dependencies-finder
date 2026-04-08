import { E } from '../e/e.tsx';

export function D() {
  // @ts-expect-error: This JSX tag requires the module path 'react/jsx-runtime' to exist, but none could be found.
  return <E />;
}
