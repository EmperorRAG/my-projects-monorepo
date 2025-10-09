import { pipe, Match } from 'effect';
import { map } from 'effect/Array';
import { isBigInt, isBoolean, isNull, isNumber, isString, isSymbol, isUndefined } from '../types/primitive.types';

/**
 * Returns the result of JavaScript's typeof operator for the given value.
 *
 * @pure This function is pure and does not have side effects.
 * @description Used internally to provide a fallback type label for unknown values.
 *
 * @param value - The value to check.
 * @returns {string} The type of the value as returned by typeof.
 */
const getTypeOf = (value: unknown): string => typeof value;

/**
 * Returns a string label describing the primitive value's type.
 *
 * @pure This function is pure and does not mutate any external state.
 * @description Uses pattern matching to determine the type of a primitive value.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `Match.value` to match against primitive type predicates.
 *
 * @param value - The primitive value to label.
 * @returns {string} The label for the primitive value.
 *
 * @example
 * getPrimitiveLabelValue(42); // 'number'
 * getPrimitiveLabelValue(null); // 'null'
 */
export const getPrimitiveLabelValue = (value: unknown): string =>
	pipe(
		Match.value(value),
		Match.when(isNull, () => 'null'),
		Match.when(isBigInt, () => 'bigint'),
		Match.when(isSymbol, () => 'symbol'),
		Match.when(isString, () => 'string'),
		Match.when(isNumber, () => 'number'),
		Match.when(isBoolean, () => 'boolean'),
		Match.when(isUndefined, () => 'undefined'),
		Match.orElse(getTypeOf)
	);

/**
 * Returns the expected value (boolean) for a given primitive value for stringability tests.
 *
 * @pure This function is pure and does not have side effects.
 * @description Determines if a primitive is considered "stringable" in the context of tests.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `Match.value` to check primitive types.
 *
 * @param value - The primitive value to check.
 * @returns {boolean} True for all primitive types.
 *
 * @example
 * getPrimitiveExpectedValue(42); // true
 * getPrimitiveExpectedValue(null); // true
 */
export const getPrimitiveExpectedValue = (value: unknown): boolean =>
	pipe(
		Match.value(value),
		Match.when(isNull, () => true),
		Match.when(isBigInt, () => true),
		Match.when(isSymbol, () => true),
		Match.when(isString, () => true),
		Match.when(isNumber, () => true),
		Match.when(isBoolean, () => true),
		Match.when(isUndefined, () => true),
		Match.orElse(() => false)
	);

/**
 * Returns an array of values representative of all JavaScript primitive types.
 *
 * @pure This function is pure and does not mutate any external state.
 * @description Provides a consistent set of primitive values for testing.
 *
 * @returns {unknown[]} An array containing one value for each primitive type.
 *
 * @example
 * const primitives = getAllPrimitiveValues();
 * // => ['string', 42, true, undefined, null, Symbol('sym'), 123n]
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
 * Maps all primitive values to their string labels.
 *
 * @pure This function is pure and composes pure functions.
 * @description Creates a pipeline to get all primitive values and then map them to their labels.
 *
 * @fp-pattern Composition
 * @composition `pipe(getAllPrimitiveValues, map(getPrimitiveLabelValue))`
 *
 * @returns {string[]} An array of string labels for each primitive value.
 *
 * @example
 * getAllPrimitiveLabelValues();
 * // => ['string', 'number', 'boolean', 'undefined', 'null', 'symbol', 'bigint']
 */
export const getAllPrimitiveLabelValues = (): string[] => pipe(getAllPrimitiveValues(), map(getPrimitiveLabelValue));

/**
 * Maps all primitive values to their expected boolean values for stringability tests.
 *
 * @pure This function is pure and composes pure functions.
 * @description Creates a pipeline to get all primitive values and then map them to their expected boolean values.
 *
 * @fp-pattern Composition
 * @composition `pipe(getAllPrimitiveValues, map(getPrimitiveExpectedValue))`
 *
 * @returns {boolean[]} An array of expected boolean values for each primitive value.
 *
 * @example
 * getAllPrimitiveExpectedValues();
 * // => [true, true, true, true, true, true, true]
 */
export const getAllPrimitiveExpectedValues = (): boolean[] => pipe(getAllPrimitiveValues(), map(getPrimitiveExpectedValue));
