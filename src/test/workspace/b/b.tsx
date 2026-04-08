import { A } from '../a/a.tsx';

export function B() {
  // @ts-expect-error: This JSX tag requires the module path 'react/jsx-runtime' to exist, but none could be found.
  return <A />;
}
