import { isBigInt, isBoolean, isNull, isNumber, isString, isSymbol, isUndefined } from '../types/primitive.types';

/**
 * Returns the result of JavaScript's typeof operator for the given value.
 * Used internally to provide a fallback type label for unknown values.
 *
 * @param value - The value to check.
 * @returns {string} The type of the value as returned by typeof.
 */
const getTypeOf = (value: unknown): string => typeof value;

/**
 * Returns a string label describing the primitive value's type.
 * This function is pure and does not mutate any external state.
 *
 * @param value - The primitive value to label.
 * @returns {string} The label for the primitive value.
 *
 * Example usage:
 *   getPrimitiveLabelValue(42); // 'number'
 *   getPrimitiveLabelValue(null); // 'null'
 *   getPrimitiveLabelValue(Symbol('sym')); // 'symbol'
 */
export const getPrimitiveLabelValue = (value: unknown): string => {
	if (isNull(value)) return 'null';
	if (isBigInt(value)) return 'bigint';
	if (isSymbol(value)) return 'symbol';
	if (isString(value)) return 'string';
	if (isNumber(value)) return 'number';
	if (isBoolean(value)) return 'boolean';
	if (isUndefined(value)) return 'undefined';
	return getTypeOf(value);
};

/**
 * Returns the expected value (boolean) for a given primitive value for stringability tests.
 * This function is pure and always returns true for all JavaScript primitive types.
 *
 * @param value - The primitive value to check.
 * @returns {boolean} Always true for primitives.
 *
 * Example usage:
 *   getPrimitiveExpectedValue(42); // true
 *   getPrimitiveExpectedValue(null); // true
 */
export const getPrimitiveExpectedValue = (value: unknown): boolean => {
	if (isNull(value)) return true;
	if (isBigInt(value)) return true;
	if (isSymbol(value)) return true;
	if (isString(value)) return true;
	if (isNumber(value)) return true;
	if (isBoolean(value)) return true;
	if (isUndefined(value)) return true;
	return false;
};

/**
 * Returns an array of values representative of all JavaScript primitive types.
 * This function is pure and does not mutate any external state.
 *
 * @returns {unknown[]} An array containing one value for each primitive type.
 *
 * Example usage:
 *   const primitives = getAllPrimitiveValues();
 *   // ['string', 42, true, undefined, null, Symbol('sym'), 123n]
 */
export const getAllPrimitiveValues = (): unknown[] => [
	'string', // string
	42, // number
	true, // boolean
	undefined, // undefined
	null, // null
	Symbol('sym'), // symbol
	123n, // bigint
];

/**
 * Maps all primitive values to their string labels using getPrimitiveLabelValue.
 * This function is pure and composes getAllPrimitiveValues and getPrimitiveLabelValue.
 *
 * @returns {string[]} An array of string labels for each primitive value.
 *
 * Example usage:
 *   getAllPrimitiveLabelValues();
 *   // ['string', 'number', 'boolean', 'undefined', 'null', 'symbol', 'bigint']
 */
export const getAllPrimitiveLabelValues = (): string[] => getAllPrimitiveValues().map(getPrimitiveLabelValue);

/**
 * Maps all primitive values to their expected boolean values using getPrimitiveExpectedValue.
 * This function is pure and composes getAllPrimitiveValues and getPrimitiveExpectedValue.
 *
 * @returns {boolean[]} An array of expected boolean values for each primitive value.
 *
 * Example usage:
 *   getPrimitiveExpectedValues();
 *   // [true, true, ...]
 */
export const getAllPrimitiveExpectedValues = (): boolean[] => getAllPrimitiveValues().map(getPrimitiveExpectedValue);
