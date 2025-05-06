// @ts-expect-error: An import path cannot end with a '.tsx' extension.
import { B } from '../b/b.tsx';

export function A() {
  return (
    // @ts-expect-error: Cannot find name 'React'.
    <div>
      {/** @ts-expect-error: Cannot find name 'React'. */}
      <B />
    </div>
  );
}
