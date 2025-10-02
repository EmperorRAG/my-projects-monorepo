import { isArrowFunction, isNamedFunction } from '../types/function.types';

/**
 * Returns a string label describing the function value's type.
 * This function is pure and does not mutate any external state.
 *
 * @param fn - The function value to label.
 * @returns {string} The label for the function value.
 *
 * Example usage:
 *   getFunctionLabelValue(() => {}); // 'arrow function'
 *   getFunctionLabelValue(function namedFunc() {}); // 'named function'
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const getFunctionLabelValue = (fn: Function): string => {
	if (isArrowFunction(fn)) return 'arrow function';
	if (isNamedFunction(fn)) return 'named function';
	return 'function';
};

/**
 * Returns the expected value (boolean) for a given function value for stringability tests.
 * This function is pure and always returns true for any function.
 *
 * @param fn - The function value to check.
 * @returns {boolean} Always true for functions.
 *
 * Example usage:
 *   getFunctionExpectedValue(() => {}); // true
 *   getFunctionExpectedValue(function namedFunc() {}); // true
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const getFunctionExpectedValue = (fn: Function): boolean => {
	if (isArrowFunction(fn)) return true;
	if (isNamedFunction(fn)) return true;
	return false;
};

/**
 * Returns an array of representative function values (arrow and named functions).
 * This function is pure and does not mutate any external state.
 *
 * @returns {Function[]} An array containing representative function values.
 *
 * Example usage:
 *   const functions = getAllFunctionValues();
 *   // [() => {}, function namedFunc() {}]
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const getAllFunctionValues = (): Function[] => [
	() => {
		/* empty */
	}, // arrow function
	function namedFunc() {
		/* empty */
	}, // named function
];

/**
 * Maps all function values to their string labels using getFunctionLabelValue.
 * This function is pure and composes getAllFunctionValues and getFunctionLabelValue.
 *
 * @returns {string[]} An array of string labels for each function value.
 *
 * Example usage:
 *   getAllFunctionLabelValues();
 *   // ['arrow function', 'named function']
 */
export const getAllFunctionLabelValues = (): string[] => getAllFunctionValues().map(getFunctionLabelValue);

/**
 * Maps all function values to their expected boolean values using getFunctionExpectedValue.
 * This function is pure and composes getAllFunctionValues and getFunctionExpectedValue.
 *
 * @returns {boolean[]} An array of expected boolean values for each function value.
 *
 * Example usage:
 *   getFunctionExpectedValues();
 *   // [true, true]
 */
export const getAllFunctionExpectedValues = (): boolean[] => getAllFunctionValues().map(getFunctionExpectedValue);
