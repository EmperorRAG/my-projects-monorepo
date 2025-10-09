import { isBoolean } from '../primitive.types';

/**
 * Checks if a value is a boolean.
 *
 * @pure This function is pure.
 * @description A type guard that checks if a value is a boolean. It is an alias for `isBoolean`.
 *
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is a boolean, otherwise `false`.
 *
 * @example
 * isValueBoolean(true); // => true
 * isValueBoolean(0); // => false
 */
export const isValueBoolean = (value: unknown): value is boolean => isBoolean(value);
