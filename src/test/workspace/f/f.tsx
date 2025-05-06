// @ts-expect-error: An import path cannot end with a '.tsx' extension.
import { D } from '../d/d.tsx';

export function F() {
  return (
    // @ts-expect-error: Cannot find name 'React'.
    <div>
      {/** @ts-expect-error: Cannot find name 'React'. */}
      <D />
    </div>
  );
}
