// @ts-expect-error: An import path cannot end with a '.tsx' extension.
import { A } from '../a/a.tsx';

export function B() {
  return (
    // @ts-expect-error: Cannot find name 'React'.
    <div>
      {/** @ts-expect-error: Cannot find name 'React'. */}
      <A />
    </div>
  );
}
