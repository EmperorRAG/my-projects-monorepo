import { pipe, Match } from 'effect';

/**
 * A type alias for any function.
 *
 * @description This type is used to represent any function, avoiding the use of the generic `Function` type,
 * which is discouraged by ESLint.
 */
export type AnyFunction = (...args: unknown[]) => unknown;

/**
 * Checks if the given value is a function.
 *
 * @pure This function is pure.
 * @description A type guard that checks if a value is of type `Function`.
 *
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is a function, otherwise `false`.
 *
 * @example
 * isFunction(() => {}); // => true
 * isFunction('not a function'); // => false
 */
export const isFunction = (value: unknown): value is AnyFunction => typeof value === 'function';

/**
 * Checks if the given function is an arrow function.
 *
 * @pure This function is pure.
 * @description Determines if a function is an arrow function by checking if it's a function
 * and if its `name` property is either not present or is 'anonymous'.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` to check the function type.
 *   - `pipe(Match.value(fn), Match.when(isFunction, ...), Match.orElse(...))`
 *
 * @param fn - The function to check.
 * @returns {boolean} `true` if `fn` is an arrow function, otherwise `false`.
 *
 * @example
 * const arrowFn = () => {};
 * function namedFn() {}
 * isArrowFunction(arrowFn); // => true
 * isArrowFunction(namedFn); // => false
 */
export const isArrowFunction = (fn: unknown): fn is AnyFunction =>
	pipe(
		Match.value(fn),
		Match.when(isFunction, (f) => !f.name || f.name === 'anonymous'),
		Match.orElse(() => false)
	);

/**
 * Checks if the given function is a named function.
 *
 * @pure This function is pure.
 * @description Determines if a function is a named function by checking if it's a function
 * and has a `name` property that is not 'anonymous'.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` to check the function type.
 *   - `pipe(Match.value(fn), Match.when(isFunction, ...), Match.orElse(...))`
 *
 * @param fn - The function to check.
 * @returns {boolean} `true` if `fn` is a named function, otherwise `false`.
 *
 * @example
 * function namedFn() {}
 * const arrowFn = () => {};
 * isNamedFunction(namedFn); // => true
 * isNamedFunction(arrowFn); // => false
 */
export const isNamedFunction = (fn: unknown): fn is AnyFunction =>
	pipe(
		Match.value(fn),
		Match.when(isFunction, (f) => !!f.name && f.name !== 'anonymous'),
		Match.orElse(() => false)
	);
