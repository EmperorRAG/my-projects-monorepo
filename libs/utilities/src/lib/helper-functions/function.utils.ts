import { pipe, Match } from 'effect';
import { map } from 'effect/Array';
import { isArrowFunction, isNamedFunction } from '../types/function.types';

type AnyFunction = (...args: unknown[]) => unknown;

/**
 * Returns a string label describing the function value's type.
 *
 * @pure This function is pure and does not mutate any external state.
 * @description Uses pattern matching to determine the type of a function.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `Match.value` to match against function predicates.
 *
 * @param fn - The function value to label.
 * @returns {string} The label for the function value.
 *
 * @example
 * getFunctionLabelValue(() => {}); // 'arrow function'
 * getFunctionLabelValue(function namedFunc() {}); // 'named function'
 */
export const getFunctionLabelValue = (fn: AnyFunction): string =>
	pipe(
		Match.value(fn),
		Match.when(isArrowFunction, () => 'arrow function'),
		Match.when(isNamedFunction, () => 'named function'),
		Match.orElse(() => 'function')
	);

/**
 * Returns the expected value (boolean) for a given function value for stringability tests.
 *
 * @pure This function is pure and always returns true for any function.
 * @description Determines if a function is considered "stringable" in the context of tests.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `Match.value` to check function types.
 *
 * @param fn - The function value to check.
 * @returns {boolean} Always true for arrow and named functions, otherwise false.
 *
 * @example
 * getFunctionExpectedValue(() => {}); // true
 * getFunctionExpectedValue(function namedFunc() {}); // true
 */
export const getFunctionExpectedValue = (fn: AnyFunction): boolean =>
	pipe(
		Match.value(fn),
		Match.when(isArrowFunction, () => true),
		Match.when(isNamedFunction, () => true),
		Match.orElse(() => false)
	);

/**
 * Returns an array of representative function values.
 *
 * @pure This function is pure and does not mutate any external state.
 * @description Provides a consistent set of function values for testing.
 *
 * @returns {AnyFunction[]} An array containing representative function values.
 *
 * @example
 * const functions = getAllFunctionValues();
 * // => [() => {}, function namedFunc() {}]
 */
export const getAllFunctionValues = (): AnyFunction[] => [
	() => {
		/* empty */
	}, // arrow function
	function namedFunc() {
		/* empty */
	}, // named function
];

/**
 * Maps all function values to their string labels.
 *
 * @pure This function is pure and composes pure functions.
 * @description Creates a pipeline to get all function values and then map them to their labels.
 *
 * @fp-pattern Composition
 * @composition `pipe(getAllFunctionValues, map(getFunctionLabelValue))`
 *
 * @returns {string[]} An array of string labels for each function value.
 *
 * @example
 * getAllFunctionLabelValues();
 * // => ['arrow function', 'named function']
 */
export const getAllFunctionLabelValues = (): string[] =>
	pipe(getAllFunctionValues(), map(getFunctionLabelValue));

/**
 * Maps all function values to their expected boolean values for stringability tests.
 *
 * @pure This function is pure and composes pure functions.
 * @description Creates a pipeline to get all function values and then map them to their expected boolean values.
 *
 * @fp-pattern Composition
 * @composition `pipe(getAllFunctionValues, map(getFunctionExpectedValue))`
 *
 * @returns {boolean[]} An array of expected boolean values for each function value.
 *
 * @example
 * getAllFunctionExpectedValues();
 * // => [true, true]
 */
export const getAllFunctionExpectedValues = (): boolean[] =>
	pipe(getAllFunctionValues(), map(getFunctionExpectedValue));
