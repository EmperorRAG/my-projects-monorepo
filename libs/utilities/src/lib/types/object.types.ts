import { isValueObject } from './object/object.types';

/**
 * Checks if the given object is an array.
 * @param obj - The object to check.
 * @returns {boolean} True if obj is an array.
 */
export const isArray = (obj: unknown): boolean => Array.isArray(obj);

/**
 * Checks if the given object is a Date instance.
 * @param obj - The object to check.
 * @returns {boolean} True if obj is a Date.
 */
export const isDate = (obj: unknown): boolean => isValueObject(obj) && obj instanceof Date;

/**
 * Checks if the given object is a RegExp instance.
 * @param obj - The object to check.
 * @returns {boolean} True if obj is a RegExp.
 */
export const isRegExp = (obj: unknown): boolean => isValueObject(obj) && obj instanceof RegExp;

/**
 * Checks if the given object has a custom Symbol.toStringTag property.
 * @param obj - The object to check.
 * @returns {boolean} True if obj has a custom Symbol.toStringTag.
 */
export const hasCustomToStringTag = (obj: unknown): boolean => isValueObject(obj) && Symbol.toStringTag in obj;

/**
 * Checks if calling toString on the object throws an error.
 * @param obj - The object to check.
 * @returns {boolean} True if calling toString throws.
 */
export const throwsOnToString = (obj: unknown): boolean => {
	if (isValueObject(obj) && Object.prototype.hasOwnProperty.call(obj, 'toString') && typeof (obj as { toString: () => string }).toString === 'function') {
		try {
			(obj as { toString: () => string }).toString();
		} catch {
			return true;
		}
	}
	return false;
};

/**
 * Checks if the given object is a plain object (not array, date, regexp, or with custom toStringTag, and does not throw on toString).
 * @param obj - The object to check.
 * @returns {boolean} True if obj is a plain object.
 */
export const isPlainObject = (obj: unknown): boolean => {
	return isValueObject(obj) && !isArray(obj) && !isDate(obj) && !isRegExp(obj) && !hasCustomToStringTag(obj) && !throwsOnToString(obj);
};
