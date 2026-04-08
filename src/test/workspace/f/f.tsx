import { D } from '../d/d.tsx';

export function F() {
  // @ts-expect-error: This JSX tag requires the module path 'react/jsx-runtime' to exist, but none could be found.
  return <D />;
}
