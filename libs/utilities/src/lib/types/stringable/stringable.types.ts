import { pipe, Match } from 'effect';
import { isFunction } from '../function.types';
import { isValueObject } from '../object/object.types';
import { isPrimitive } from '../primitive.types';

/**
 * A type representing any value that can be safely passed to the `String()` constructor.
 * This includes all primitive types, objects, and functions.
 */
export type Stringable = string | number | boolean | bigint | symbol | undefined | null | object | ((...args: unknown[]) => unknown);

/**
 * A type representing any primitive value that can be safely passed to the `String()` constructor.
 * This includes all primitive types except for objects and functions.
 */
export type PrimitiveStringable = string | number | boolean | bigint | symbol | undefined | null;

/**
 * Checks if a value can be safely converted to a string.
 *
 * @pure This function is pure.
 * @description A type guard that determines if a value is `Stringable`. It returns `true` for all
 * primitives, objects, and functions, as they can all be passed to `String()`.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` to check against various type guards.
 *
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is `Stringable`, otherwise `false`.
 *
 * @example
 * isValueStringable('test'); // => true
 * isValueStringable({}); // => true
 * isValueStringable(() => {}); // => true
 */
export const isValueStringable = (value: unknown): value is Stringable =>
	pipe(
		Match.value(value),
		Match.when(isPrimitive, () => true),
		Match.when(isValueObject, () => true),

		Match.when(isFunction, () => true),
		Match.orElse(() => false)
	);

/**
 * Checks if a value is a primitive that can be safely converted to a string.
 *
 * @pure This function is pure.
 * @description A type guard that determines if a value is a `PrimitiveStringable`.
 * It returns `true` only for primitive types.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` with the `isPrimitive` type guard.
 *
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is a `PrimitiveStringable`, otherwise `false`.
 *
 * @example
 * isValuePrimitiveStringable('test'); // => true
 * isValuePrimitiveStringable({}); // => false
 * isValuePrimitiveStringable(() => {}); // => false
 */
export const isValuePrimitiveStringable = (value: unknown): value is PrimitiveStringable =>
	pipe(
		Match.value(value),
		Match.when(isPrimitive, () => true),
		Match.orElse(() => false)
	);
