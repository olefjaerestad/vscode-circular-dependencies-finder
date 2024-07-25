/**
 * Inspired by the `when` expression in Kotlin, this is an alternative to
 * `switch` statements, for when you want to use switch-like features in an expression.
 * Handy in more functional-like programming. It also offers more flexibility than 
 * a regular `switch` statement.
 *
 * @param branches
 * A list of tuples, where each tuple consists of an expression and a value.
 * The expression will be evaluated for truthiness.
 *
 * @return
 * The value of the first branch with an expression that evaluates to truthy, or undefined.
 *
 * @example
 * // Without `when`:
 * const value = 1;
 * let otherValue;
 * switch (value) {
 *   case 0:
 *     otherValue = 'foo';
 *     function0();
 *     break;
 *   case 1:
 *     otherValue = 'bar';
 *     function1();
 *     break;
 * }
 *
 * // With `when`:
 * const value = 1;
 * const otherValue = when(
 *   [value === 0, () => {
 *     function0();
 *     return 'foo';
 *   }],
 *   [value === 1, () => {
 *     function1();
 *     return 'bar';
 *   }],
 * );
 * 
 * @see https://kotlinlang.org/docs/control-flow.html#when-expression
 */
function when<
  VALUE = undefined,
  BRANCHES extends [
    Branch<NoInfer<VALUE> extends undefined ? unknown : NoInfer<VALUE>>,
    ...Branch<NoInfer<VALUE> extends undefined ? unknown : NoInfer<VALUE>>[]
  ] = [
    Branch<NoInfer<VALUE> extends undefined ? unknown : NoInfer<VALUE>>,
    ...Branch<NoInfer<VALUE> extends undefined ? unknown : NoInfer<VALUE>>[]
  ]
>(
  ...branches: BRANCHES
): VALUE extends undefined
  ? ReturnType<BRANCHES[number][1]> | undefined
  : VALUE {
  const branch = branches.find(([expr]) => {
    let use = false;
    if (typeof expr === 'function') {
      use = !!expr();
    } else {
      use = !!expr;
    }
    return use;
  });

  return branch?.[1]() as VALUE extends undefined
    ? ReturnType<BRANCHES[number][1]> | undefined
    : VALUE;
}

type Branch<VALUE> = [expression: unknown, value: () => VALUE];

export { when };
