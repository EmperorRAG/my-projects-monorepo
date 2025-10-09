import { pipe, Match } from 'effect';
import { map } from 'effect/Array';
import { isValueArrayOfStringable } from '../types/array/array.types';
import { isValueObject } from '../types/object/object.types';
import type { Stringable } from '../types/stringable/stringable.types';

/**
 * Converts a single Stringable value to its string representation using pattern matching.
 * @param value The value to convert.
 * @returns The string representation of the value.
 * @private
 * @pure
 */
const stringifyValue = (value: Stringable): string =>
	pipe(
		Match.value(value),
		Match.when(
			(v: Stringable): v is object =>
				isValueObject(v) &&
				typeof v.toString === 'function' &&
				v.toString !== Object.prototype.toString,
			(v) => String(v)
		),
		Match.when(isValueObject, (v) => JSON.stringify(v)),
		Match.orElse((v) => String(v))
	);

/**
 * Converts an array of Stringable values to an array of strings.
 *
 * @pure This function is pure.
 * @description Overloaded function that converts a `Stringable` or `Stringable[]` to its string representation.
 *
 * @fp-pattern Pattern Matching, Higher-order function
 * @composition Uses `pipe` and `Match` to handle different input types.
 *   - For arrays, it maps over the array, applying `stringifyValue`.
 *   - For single values, it applies `stringifyValue` directly.
 *
 * @param value - An array of values to convert.
 * @returns An array of string representations for each element.
 *
 * @example
 * toString([1, 2, 3]); // => ["1", "2", "3"]
 */
export function toString(value: readonly Stringable[]): string[];
/**
 * Converts a single Stringable value to its string representation.
 *
 * @pure This function is pure.
 * @param value - The value to convert.
 * @returns The string representation of the value.
 *
 * @example
 * toString(42); // => "42"
 */
export function toString(value: Stringable): string;
export function toString(value: Stringable | readonly Stringable[]): string | string[] {
	return pipe(
		Match.value(value),
		Match.when(isValueArrayOfStringable, (arr) => pipe(arr, map(stringifyValue))),
		Match.orElse(stringifyValue)
	);
}
