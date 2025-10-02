import { isValueArrayOfStringable } from '../types/array/array.types';
import { isValueObject } from '../types/object/object.types';
import type { Stringable } from '../types/stringable/stringable.types';

/**
 * Converts an array of Stringable values to an array of strings.
 *
 * @param value - An array of values to convert. Each element should be a Stringable (string, number, boolean, or object with a custom toString method).
 * @returns An array of string representations for each element.
 *
 * @example
 * toString([1, 2, 3]); // ["1", "2", "3"]
 * toString([{ foo: "bar" }, 7]); // ['{"foo":"bar"}', "7"]
 */
export function toString(value: Stringable[]): string[];
/**
 * Converts a single Stringable value to its string representation.
 *
 * @param value - The value to convert. Should be a string, number, boolean, or object with a custom toString method.
 * @returns The string representation of the value.
 *
 * @example
 * toString(42); // "42"
 * toString({ foo: "bar" }); // '{"foo":"bar"}'
 */
export function toString(value: Stringable): string;
/**
 * Converts a Stringable value or an array of Stringable values to their string representations.
 *
 * @param value - The value or array of values to convert.
 * @returns A string or array of strings, depending on the input.
 *
 * @see toString
 */
export function toString(value: Stringable | Stringable[]): string | string[] {
	if (isValueArrayOfStringable(value)) {
		return value.map((v) => {
			if (isValueObject(v) && typeof v.toString === 'function' && v.toString !== Object.prototype.toString) {
				// eslint-disable-next-line @typescript-eslint/no-base-to-string
				return String(v);
			}
			if (isValueObject(v)) {
				return JSON.stringify(v);
			}
			return String(v);
		});
	}
	if (isValueObject(value) && typeof value.toString === 'function' && value.toString !== Object.prototype.toString) {
		// eslint-disable-next-line @typescript-eslint/no-base-to-string
		return String(value);
	}
	if (isValueObject(value)) {
		return JSON.stringify(value);
	}
	return String(value);
}
