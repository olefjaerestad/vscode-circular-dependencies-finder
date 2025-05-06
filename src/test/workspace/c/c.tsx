// @ts-expect-error: An import path cannot end with a '.tsx' extension.
import { E } from '../e/e.tsx';

export function C() {
  return (
    // @ts-expect-error: Cannot find name 'React'.
    <div>
      {/** @ts-expect-error: Cannot find name 'React'. */}
      <E />
    </div>
  );
}
