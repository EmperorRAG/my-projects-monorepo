import { pipe, Match } from 'effect';
import { isValueObject } from './object/object.types';

/**
 * Checks if a value is an array.
 *
 * @pure This function is pure.
 * @description A type guard that checks if a value is an array.
 *
 * @param obj - The value to check.
 * @returns {boolean} `true` if the value is an array, otherwise `false`.
 *
 * @example
 * isArray([]); // => true
 * isArray({}); // => false
 */
export const isArray = (obj: unknown): obj is unknown[] => Array.isArray(obj);

/**
 * Checks if a value is a Date instance.
 *
 * @pure This function is pure.
 * @description A type guard that determines if a value is a `Date` object.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` to check the value type.
 *
 * @param obj - The value to check.
 * @returns {boolean} `true` if the value is a `Date`, otherwise `false`.
 *
 * @example
 * isDate(new Date()); // => true
 * isDate('2025-10-09'); // => false
 */
export const isDate = (obj: unknown): obj is Date =>
	pipe(
		Match.value(obj),
		Match.when(
			(v: unknown): v is Date => isValueObject(v) && v instanceof Date,
			() => true
		),
		Match.orElse(() => false)
	);

/**
 * Checks if a value is a RegExp instance.
 *
 * @pure This function is pure.
 * @description A type guard that determines if a value is a `RegExp` object.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` to check the value type.
 *
 * @param obj - The value to check.
 * @returns {boolean} `true` if the value is a `RegExp`, otherwise `false`.
 *
 * @example
 * isRegExp(/a/); // => true
 * isRegExp('/a/'); // => false
 */
export const isRegExp = (obj: unknown): obj is RegExp =>
	pipe(
		Match.value(obj),
		Match.when(
			(v: unknown): v is RegExp => isValueObject(v) && v instanceof RegExp,
			() => true
		),
		Match.orElse(() => false)
	);

/**
 * Checks if an object has a custom `Symbol.toStringTag` property.
 *
 * @pure This function is pure.
 * @description Determines if an object has its own `Symbol.toStringTag` property.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` to inspect the object.
 *
 * @param obj - The value to check.
 * @returns {boolean} `true` if the object has a custom `toStringTag`, otherwise `false`.
 *
 * @example
 * const customTagged = { [Symbol.toStringTag]: 'Custom' };
 * hasCustomToStringTag(customTagged); // => true
 * hasCustomToStringTag({}); // => false
 */
export const hasCustomToStringTag = (obj: unknown): boolean =>
	pipe(
		Match.value(obj),
		Match.when(
			(v: unknown): v is object => isValueObject(v) && Symbol.toStringTag in v,
			() => true
		),
		Match.orElse(() => false)
	);

/**
 * Checks if calling `toString()` on an object throws an error.
 *
 * @pure This function is pure but simulates an impure action's outcome.
 * @description Checks if an object's `toString` method will throw an error when called.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` with a `try-catch` block inside a predicate.
 *
 * @param obj - The value to check.
 * @returns {boolean} `true` if `toString()` throws, otherwise `false`.
 *
 * @example
 * const faulty = { toString: () => { throw new Error(); } };
 * throwsOnToString(faulty); // => true
 * throwsOnToString({ toString: () => 'ok' }); // => false
 */
export const throwsOnToString = (obj: unknown): boolean => {
	const check = (v: { toString: () => string }): boolean => {
		try {
			v.toString();
			return false;
		} catch {
			return true;
		}
	};

	return pipe(
		Match.value(obj),
		Match.when(
			(v: unknown): v is { toString: () => string } =>
				isValueObject(v) &&
				Object.prototype.hasOwnProperty.call(v, 'toString') &&
				typeof (v as { toString: () => string }).toString === 'function',
			check
		),
		Match.orElse(() => false)
	);
};

/**
 * Checks if a value is a plain object.
 *
 * @pure This function is pure.
 * @description A plain object is an object that is not an array, date, or RegExp,
 * does not have a custom `toStringTag`, and whose `toString` method does not throw.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` to combine multiple type guards.
 *
 * @param obj - The value to check.
 * @returns {boolean} `true` if the value is a plain object, otherwise `false`.
 *
 * @example
 * isPlainObject({}); // => true
 * isPlainObject([]); // => false
 * isPlainObject(new Date()); // => false
 */
export const isPlainObject = (obj: unknown): obj is object =>
	pipe(
		Match.value(obj),
		Match.when(
			(v: unknown): v is object =>
				isValueObject(v) &&
				!isArray(v) &&
				!isDate(v) &&
				!isRegExp(v) &&
				!hasCustomToStringTag(v) &&
				!throwsOnToString(v),
			() => true
		),
		Match.orElse(() => false)
	);
