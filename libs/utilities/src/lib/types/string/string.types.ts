import { isString } from '../primitive.types';

/**
 * Checks if a value is a string.
 *
 * @pure This function is pure.
 * @description A type guard that checks if a value is a string. It is an alias for `isString`.
 *
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is a string, otherwise `false`.
 *
 * @example
 * isValueString('hello'); // => true
 * isValueString(123); // => false
 */
export const isValueString = (value: unknown): value is string => isString(value);
