/**
 * Checks if a value is null.
 * @param value - The value to check.
 * @returns {boolean} True if value is null.
 */
export const isNull = (value: unknown): value is null => value === null;

/**
 * Checks if a value is a bigint primitive.
 * @param value - The value to check.
 * @returns {boolean} True if value is a bigint primitive.
 */
export const isBigInt = (value: unknown): value is bigint => typeof value === 'bigint';

/**
 * Checks if a value is a symbol primitive.
 * @param value - The value to check.
 * @returns {boolean} True if value is a symbol primitive.
 */
export const isSymbol = (value: unknown): value is symbol => typeof value === 'symbol';

/**
 * Checks if a value is a string primitive.
 * @param value - The value to check.
 * @returns {boolean} True if value is a string primitive.
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Checks if a value is a number primitive (not NaN).
 * @param value - The value to check.
 * @returns {boolean} True if value is a number primitive and not NaN.
 */
export const isNumber = (value: unknown): value is number => typeof value === 'number' && !Number.isNaN(value);

/**
 * Checks if a value is a boolean primitive.
 * @param value - The value to check.
 * @returns {boolean} True if value is a boolean primitive.
 */
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/**
 * Checks if a value is undefined.
 * @param value - The value to check.
 * @returns {boolean} True if value is undefined.
 */
export const isUndefined = (value: unknown): value is undefined => value === undefined;

/**
 * Checks if a value is a primitive type (string, number, boolean, undefined, null, symbol, bigint).
 * @param value - The value to check.
 * @returns {boolean} True if value is a primitive.
 */
export const isPrimitive = (value: unknown): boolean =>
	isString(value) || isNumber(value) || isBoolean(value) || isUndefined(value) || isNull(value) || isSymbol(value) || isBigInt(value);
