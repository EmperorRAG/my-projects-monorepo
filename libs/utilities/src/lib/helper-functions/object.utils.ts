import { pipe, Match } from 'effect';
import { map } from 'effect/Array';
import { hasCustomToStringTag, isArray, isDate, isPlainObject, isRegExp, throwsOnToString } from '../types/object.types';

/**
 * Returns a string label describing the object value's type.
 *
 * @pure This function is pure and does not mutate any external state.
 * @description Uses pattern matching to determine the type of an object.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `Match.value` to match against object type predicates.
 *
 * @param obj - The object value to label.
 * @returns {string} The label for the object value.
 *
 * @example
 * getObjectLabelValue({}); // 'plain object'
 * getObjectLabelValue([]); // 'array'
 */
export const getObjectLabelValue = (obj: object): string =>
	pipe(
		Match.value(obj),
		Match.when(isArray, () => 'array'),
		Match.when(isDate, () => 'Date'),
		Match.when(isRegExp, () => 'RegExp'),
		Match.when(hasCustomToStringTag, () => 'custom Symbol.toStringTag'),
		Match.when(throwsOnToString, () => 'throws on toString'),
		Match.when(isPlainObject, () => 'plain object'),
		Match.orElse(() => 'object')
	);

/**
 * Returns the expected value (boolean) for a given object value for stringability tests.
 *
 * @pure This function is pure and does not have side effects.
 * @description Determines if an object is considered "stringable" in the context of tests.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `Match.value` to check object types.
 *
 * @param obj - The object value to check.
 * @returns {boolean} True for most object types, false for unhandled cases.
 *
 * @example
 * getObjectExpectedValue({}); // true
 * getObjectExpectedValue([]); // true
 */
export const getObjectExpectedValue = (obj: object): boolean =>
	pipe(
		Match.value(obj),
		Match.when(isArray, () => true),
		Match.when(isDate, () => true),
		Match.when(isRegExp, () => true),
		Match.when(hasCustomToStringTag, () => true),
		Match.when(throwsOnToString, () => true),
		Match.when(isPlainObject, () => true),
		Match.orElse(() => false)
	);

/**
 * Returns an array of representative object values.
 *
 * @pure This function is pure and does not mutate any external state.
 * @description Provides a consistent set of object values for testing purposes.
 *
 * @returns {object[]} An array containing representative object values.
 *
 * @example
 * const objects = getAllObjectValues();
 * // => [{}, [], new Date(), /abc/, ...]
 */
export const getAllObjectValues = (): object[] => [
	{}, // plain object
	[], // array
	new Date(), // Date
	/abc/, // RegExp
	{ [Symbol.toStringTag]: 'Custom' }, // custom object with Symbol.toStringTag
	{
		toString() {
			throw new Error('fail');
		},
	}, // object that throws on String conversion
];

/**
 * Maps all object values to their string labels.
 *
 * @pure This function is pure and composes pure functions.
 * @description Creates a pipeline to get all object values and then map them to their labels.
 *
 * @fp-pattern Composition
 * @composition `pipe(getAllObjectValues, map(getObjectLabelValue))`
 *
 * @returns {string[]} An array of string labels for each object value.
 *
 * @example
 * getAllObjectLabelValues();
 * // => ['plain object', 'array', 'Date', 'RegExp', 'custom Symbol.toStringTag', 'throws on toString']
 */
export const getAllObjectLabelValues = (): string[] => pipe(getAllObjectValues(), map(getObjectLabelValue));

/**
 * Maps all object values to their expected boolean values for stringability tests.
 *
 * @pure This function is pure and composes pure functions.
 * @description Creates a pipeline to get all object values and then map them to their expected boolean values.
 *
 * @fp-pattern Composition
 * @composition `pipe(getAllObjectValues, map(getObjectExpectedValue))`
 *
 * @returns {boolean[]} An array of expected boolean values for each object value.
 *
 * @example
 * getObjectExpectedValues();
 * // => [true, true, true, true, true, true]
 */
export const getAllObjectExpectedValues = (): boolean[] => pipe(getAllObjectValues(), map(getObjectExpectedValue));
