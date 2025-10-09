import { pipe, Match } from 'effect';

/**
 * Checks if a value is the primitive value `null`.
 *
 * @pure This function is pure.
 * @param value - The value to check.
 * @returns `true` if the value is `null`, otherwise `false`.
 * @example
 * isNull(null); // => true
 */
export const isNull = (value: unknown): value is null => value === null;

/**
 * Checks if a value is a `bigint` primitive.
 *
 * @pure This function is pure.
 * @param value - The value to check.
 * @returns `true` if the value is a `bigint`, otherwise `false`.
 * @example
 * isBigInt(1n); // => true
 */
export const isBigInt = (value: unknown): value is bigint => typeof value === 'bigint';

/**
 * Checks if a value is a `symbol` primitive.
 *
 * @pure This function is pure.
 * @param value - The value to check.
 * @returns `true` if the value is a `symbol`, otherwise `false`.
 * @example
 * isSymbol(Symbol('a')); // => true
 */
export const isSymbol = (value: unknown): value is symbol => typeof value === 'symbol';

/**
 * Checks if a value is a `string` primitive.
 *
 * @pure This function is pure.
 * @param value - The value to check.
 * @returns `true` if the value is a `string`, otherwise `false`.
 * @example
 * isString('hello'); // => true
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Checks if a value is a `number` primitive and not `NaN`.
 *
 * @pure This function is pure.
 * @description A type guard that checks if a value is a number, excluding `NaN`.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `pipe` and `Match` to check for `number` type and `NaN`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `number` (and not `NaN`), otherwise `false`.
 * @example
 * isNumber(123); // => true
 * isNumber(NaN); // => false
 */
export const isNumber = (value: unknown): value is number =>
	pipe(
		Match.value(value),
		Match.when(
			(v: unknown): v is number => typeof v === 'number' && !Number.isNaN(v),
			() => true
		),
		Match.orElse(() => false)
	);

/**
 * Checks if a value is a `boolean` primitive.
 *
 * @pure This function is pure.
 * @param value - The value to check.
 * @returns `true` if the value is a `boolean`, otherwise `false`.
 * @example
 * isBoolean(true); // => true
 */
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/**
 * Checks if a value is `undefined`.
 *
 * @pure This function is pure.
 * @param value - The value to check.
 * @returns `true` if the value is `undefined`, otherwise `false`.
 * @example
 * isUndefined(undefined); // => true
 */
export const isUndefined = (value: unknown): value is undefined => value === undefined;

/**
 * A type representing all primitive types in TypeScript.
 */
export type Primitive = string | number | boolean | undefined | null | symbol | bigint;

/**
 * Checks if a value is a primitive type.
 *
 * @pure This function is pure.
 * @description A type guard that checks if a value is one of the primitive types.
 *
 * @fp-pattern Pattern Matching
 * @composition Uses `Match.any` to check against a list of primitive type guards.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a primitive, otherwise `false`.
 * @example
 * isPrimitive('hello'); // => true
 * isPrimitive({}); // => false
 */
export const isPrimitive = (value: unknown): value is Primitive =>
	pipe(
		Match.value(value),
		Match.when(isString, () => true),
		Match.when(isNumber, () => true),
		Match.when(isBoolean, () => true),
		Match.when(isUndefined, () => true),
		Match.when(isNull, () => true),
		Match.when(isSymbol, () => true),
		Match.when(isBigInt, () => true),
		Match.orElse(() => false)
	);
