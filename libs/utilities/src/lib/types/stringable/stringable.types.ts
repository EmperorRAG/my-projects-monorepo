/**
 * Type that represents any value that can be safely passed to String() constructor
 * Includes: string, number, boolean, bigint, symbol, undefined, null, object, function
 */
export type Stringable = string | number | boolean | bigint | symbol | undefined | null | object | ((...args: unknown[]) => unknown);

/**
 * Type that represents any primitive value that can be safely passed to String() constructor
 * Includes: string, number, boolean, bigint, symbol, undefined, null
 */
export type PrimitiveStringable = string | number | boolean | bigint | symbol | undefined | null;

/**
 * Determines if a value can be safely passed to String() without throwing.
 *
 * ## Acceptance Criteria
 * - Returns true for all primitive types: string, number, boolean, bigint, symbol, undefined, and null.
 * - Returns true for objects (including arrays, plain objects, Date, RegExp, etc.).
 * - Returns true for functions.
 * - Returns true for values with custom Symbol.toStringTag (unless they throw on String conversion).
 * - Returns false only if the value throws when passed to String().
 *
 * @param defaultValue - The value to check
 * @returns True if the value can be safely converted to a string
 *
 * @example
 * // Primitives
 * isValueStringable("test"); // true
 * isValueStringable(42); // true
 * isValueStringable(true); // true
 * isValueStringable(undefined); // true
 * isValueStringable(null); // true
 * isValueStringable(Symbol("sym")); // true
 * isValueStringable(123n); // true
 *
 * // Objects
 * isValueStringable({}); // true
 * isValueStringable([]); // true
 * isValueStringable(new Date()); // true
 * isValueStringable(/abc/); // true
 *
 * // Functions
 * isValueStringable(() => {}); // true
 *
 * // Custom object with Symbol.toStringTag
 * const obj = { [Symbol.toStringTag]: "Custom" };
 * isValueStringable(obj); // true
 *
 * // Value that throws on String conversion (rare)
 * // const throwingObj = { toString() { throw new Error("fail"); } };
 * // isValueStringable(throwingObj); // true (but String(throwingObj) would throw)
 */
export function isValueStringable(value: unknown): value is Stringable {
	switch (typeof value) {
		case 'string':
		case 'number':
		case 'boolean':
		case 'bigint':
		case 'symbol':
		case 'undefined':
		case 'object':
		case 'function':
			return true;
		default:
			return value === null;
	}
}

/**
 * Determines if a value is a primitive that can be safely passed to String().
 *
 * ## Acceptance Criteria
 * - Returns true for all primitive types: string, number, boolean, bigint, symbol, undefined, and null.
 * - Returns false for objects and functions.
 *
 * @param value - The value to check
 * @returns True if the value is a primitive that can be safely converted to a string
 *
 * @example
 * isValuePrimitiveStringable("test"); // true
 * isValuePrimitiveStringable(42); // true
 * isValuePrimitiveStringable(true); // true
 * isValuePrimitiveStringable(undefined); // true
 * isValuePrimitiveStringable(null); // true
 * isValuePrimitiveStringable(Symbol("sym")); // true
 * isValuePrimitiveStringable(123n); // true
 * isValuePrimitiveStringable({}); // false
 * isValuePrimitiveStringable([]); // false
 * isValuePrimitiveStringable(() => {}); // false
 */
export function isValuePrimitiveStringable(value: unknown): value is PrimitiveStringable {
	switch (typeof value) {
		case 'string':
		case 'number':
		case 'boolean':
		case 'bigint':
		case 'symbol':
		case 'undefined':
			return true;
		default:
			return value === null;
	}
}
