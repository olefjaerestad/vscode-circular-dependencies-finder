import { B } from '../b/b.tsx';

export function A() {
  // @ts-expect-error: This JSX tag requires the module path 'react/jsx-runtime' to exist, but none could be found.
  return <B />;
}
