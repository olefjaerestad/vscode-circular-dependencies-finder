import { F } from '../f/f.jsx';

export function E() {
  // @ts-expect-error: This JSX tag requires the module path 'react/jsx-runtime' to exist, but none could be found.
  return <F />;
}
