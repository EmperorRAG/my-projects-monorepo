import { pipe, Match } from 'effect';
import { every } from 'effect/Array';
import { values } from 'effect/Record';
import { isValueArrayOfUnknowns } from '../array/array.types';
import { isValueObject } from '../object/object.types';

/**
 * Checks if a value is a record of unknown values.
 *
 * @pure This function is pure.
 * @description A type guard that checks if a value is an object but not an array.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` to check the value type.
 *
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is a record, otherwise `false`.
 *
 * @example
 * isValueRecordOfUnknown({}); // => true
 * isValueRecordOfUnknown([]); // => false
 */
export const isValueRecordOfUnknown = (value: unknown): value is Record<string, unknown> =>
	pipe(
		Match.value(value),
		Match.when(
			(v: unknown): v is Record<string, unknown> => isValueObject(v) && !isValueArrayOfUnknowns(v),
			() => true
		),
		Match.orElse(() => false)
	);

/**
 * A higher-order function that returns a type guard to check if a value is a record of a specific type.
 *
 * @pure This function is pure.
 * @description Creates a type guard for a record of type `T`. It takes a `valueGuard` for `T`
 * and returns a new function that checks if a given value is a record where every value
 * satisfies the `valueGuard`.
 *
 * @fp-pattern Higher-order function
 *
 * @param valueGuard - A type guard function for the values of the record.
 * @returns A function that acts as a type guard for a record of `T`.
 *
 * @example
 * const isStringRecord = isValueRecordOf(isString);
 * isStringRecord({ a: '1', b: '2' }); // => true
 * isStringRecord({ a: '1', b: 2 }); // => false
 */
export const isValueRecordOf =
	<T>(valueGuard: (v: unknown) => v is T) =>
	(value: unknown): value is Record<string, T> =>
		pipe(
			Match.value(value),
			Match.when(isValueRecordOfUnknown, (record) => pipe(values(record), every(valueGuard))),
			Match.orElse(() => false)
		);
