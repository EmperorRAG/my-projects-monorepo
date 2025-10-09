import { pipe, Match } from 'effect';

/**
 * Checks if a value is a non-null object.
 *
 * @pure This function is pure.
 * @description A type guard that checks if a value is an object and not `null`.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` to check the value's type.
 *
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is a non-null object, otherwise `false`.
 *
 * @example
 * isValueObject({}); // => true
 * isValueObject(null); // => false
 * isValueObject('string'); // => false
 */
export const isValueObject = (value: unknown): value is object =>
	pipe(
		Match.value(value),
		Match.when(
			(v: unknown): v is object => typeof v === 'object' && v !== null,
			() => true
		),
		Match.orElse(() => false)
	);
