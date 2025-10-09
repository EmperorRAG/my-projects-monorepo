import { isNumber } from '../primitive.types';

/**
 * Checks if a value is a number.
 *
 * @pure This function is pure.
 * @description A type guard that checks if a value is a number. It is an alias for `isNumber`.
 *
 * @param value - The value to check.
 * @returns {boolean} `true` if the value is a number, otherwise `false`.
 *
 * @example
 * isValueNumber(123); // => true
 * isValueNumber('123'); // => false
 */
export const isValueNumber = (value: unknown): value is number => isNumber(value);
