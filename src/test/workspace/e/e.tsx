// @ts-expect-error: An import path cannot end with a '.tsx' extension.
import { F } from '../f/f.tsx';

export function E() {
  return (
    // @ts-expect-error: Cannot find name 'React'.
    <div>
      {/** @ts-expect-error: Cannot find name 'React'. */}
      <F />
    </div>
  );
}
