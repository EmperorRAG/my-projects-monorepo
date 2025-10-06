/**
 * Checks if a value is the primitive value `null`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is `null`, otherwise `false`.
 * @example
 * isNull(null); // => true
 * isNull(undefined); // => false
 * isNull(''); // => false
 */
export const isNull = (value: unknown): value is null => value === null;

/**
 * Checks if a value is a `bigint` primitive.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `bigint`, otherwise `false`.
 * @example
 * isBigInt(1n); // => true
 * isBigInt(1); // => false
 */
export const isBigInt = (value: unknown): value is bigint => typeof value === 'bigint';

/**
 * Checks if a value is a `symbol` primitive.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `symbol`, otherwise `false`.
 * @example
 * isSymbol(Symbol('a')); // => true
 * isSymbol('a'); // => false
 */
export const isSymbol = (value: unknown): value is symbol => typeof value === 'symbol';

/**
 * Checks if a value is a `string` primitive.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `string`, otherwise `false`.
 * @example
 * isString('hello'); // => true
 * isString(new String('hello')); // => false
 * isString(1); // => false
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Checks if a value is a `number` primitive and not `NaN`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `number` (and not `NaN`), otherwise `false`.
 * @example
 * isNumber(123); // => true
 * isNumber(NaN); // => false
 * isNumber('123'); // => false
 */
export const isNumber = (value: unknown): value is number => typeof value === 'number' && !Number.isNaN(value);

/**
 * Checks if a value is a `boolean` primitive.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `boolean`, otherwise `false`.
 * @example
 * isBoolean(true); // => true
 * isBoolean(false); // => true
 * isBoolean(0); // => false
 */
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/**
 * Checks if a value is `undefined`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is `undefined`, otherwise `false`.
 * @example
 * isUndefined(undefined); // => true
 * isUndefined(null); // => false
 */
export const isUndefined = (value: unknown): value is undefined => value === undefined;

/**
 * Checks if a value is a primitive type.
 *
 * @remarks
 * Primitive types include `string`, `number`, `boolean`, `undefined`, `null`, `symbol`, and `bigint`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a primitive, otherwise `false`.
 * @example
 * isPrimitive('hello'); // => true
 * isPrimitive(123); // => true
 * isPrimitive(false); // => true
 * isPrimitive({}); // => false
 * isPrimitive([]); // => false
 */
export const isPrimitive = (value: unknown): boolean =>
	isString(value) || isNumber(value) || isBoolean(value) || isUndefined(value) || isNull(value) || isSymbol(value) || isBigInt(value);
