import { isArray } from '../object.types';
import { isString } from '../primitive.types';
import { isValueStringable } from '../stringable/stringable.types';
import type { Stringable } from '../stringable/stringable.types';

export function isValueArrayOfStrings(value: unknown): value is string[] {
	return isValueArrayOf(value, isString);
}

export function isValueArrayOfUnknowns(value: unknown): value is unknown[] {
	return isArray(value);
}

/**
 * Type guard to check if a value is an array of T, using a provided valueGuard.
 * @param value - The value to check.
 * @param valueGuard - The type guard for the array element type.
 * @returns True if value is an array and every element passes valueGuard.
 */
export function isValueArrayOf<T>(value: unknown, valueGuard: (v: unknown) => v is T): value is T[] {
	return isValueArrayOfUnknowns(value) && value.every(valueGuard);
}

export function isValueArrayOfStringable(value: unknown): value is Stringable[] {
	return isValueArrayOf(value, isValueStringable);
}
