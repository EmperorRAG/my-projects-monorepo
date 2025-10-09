import { pipe, Match } from 'effect';
import { every } from 'effect/Array';
import { isArray } from '../object.types';
import { isString } from '../primitive.types';
import { isValueStringable } from '../stringable/stringable.types';

/**
 * Checks if a value is an array of unknown elements.
 *
 * @pure This function is pure.
 * @description A type guard that checks if a value is an array. It is an alias for `isArray`.
 *
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is an array, otherwise `false`.
 *
 * @example
 * isValueArrayOfUnknowns([1, 'a']); // => true
 * isValueArrayOfUnknowns({}); // => false
 */
export const isValueArrayOfUnknowns = (value: unknown): value is unknown[] => isArray(value);

/**
 * A higher-order function that returns a type guard to check if a value is an array of a specific type.
 *
 * @pure This function is pure.
 * @description Creates a type guard for an array of type `T`. It takes a `valueGuard` for `T`
 * and returns a new function that checks if a given value is an array where every element
 * satisfies the `valueGuard`.
 *
 * @fp-pattern Higher-order function
 *
 * @param valueGuard - A type guard function for the elements of the array.
 * @returns A function that acts as a type guard for an array of `T`.
 *
 * @example
 * const isNumberArray = isValueArrayOf(isNumber);
 * isNumberArray([1, 2, 3]); // => true
 * isNumberArray([1, '2', 3]); // => false
 */
export const isValueArrayOf =
	<T>(valueGuard: (v: unknown) => v is T) =>
	(value: unknown): value is T[] =>
		pipe(
			Match.value(value),
			Match.when(isValueArrayOfUnknowns, (arr) => pipe(arr, every(valueGuard))),
			Match.orElse(() => false)
		);

/**
 * A type guard that checks if a value is an array of strings.
 *
 * @pure This function is pure.
 * @description This is a specialized version of `isValueArrayOf` with `isString` as the type guard.
 *
 * @fp-pattern Higher-order function
 *
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is an array of strings, otherwise `false`.
 *
 * @example
 * isValueArrayOfStrings(['a', 'b']); // => true
 * isValueArrayOfStrings(['a', 1]); // => false
 */
export const isValueArrayOfStrings = isValueArrayOf(isString);

/**
 * A type guard that checks if a value is an array of `Stringable` types.
 *
 * @pure This function is pure.
 * @description This is a specialized version of `isValueArrayOf` with `isValueStringable` as the type guard.
 *
 * @fp-pattern Higher-order function
 *
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is an array of `Stringable` types, otherwise `false`.
 *
 * @example
 * isValueArrayOfStringable([1, 'a', true]); // => true
 * isValueArrayOfStringable([1, {}]); // => false
 */
export const isValueArrayOfStringable = isValueArrayOf(isValueStringable);
