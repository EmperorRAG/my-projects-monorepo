import { pipe, Match } from 'effect';
import { isValueNumber } from '../number/number.types';
import { isValueString } from '../string/string.types';

/**
 * Checks if a value is either a string or a number.
 *
 * @pure This function is pure.
 * @description A type guard that checks if a value is of type `string` or `number`.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` to check against `isValueString` and `isValueNumber`.
 *
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is a string or a number, otherwise `false`.
 *
 * @example
 * isValueStringOrNumber('hello'); // => true
 * isValueStringOrNumber(123); // => true
 * isValueStringOrNumber(true); // => false
 */
export const isValueStringOrNumber = (value: unknown): value is string | number =>
	pipe(
		Match.value(value),
		Match.when(isValueString, () => true),
		Match.when(isValueNumber, () => true),
		Match.orElse(() => false)
	);
