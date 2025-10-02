import { hasCustomToStringTag, isArray, isDate, isPlainObject, isRegExp, throwsOnToString } from '../types/object.types';

/**
 * Returns a string label describing the object value's type.
 * This function is pure and does not mutate any external state.
 *
 * @param obj - The object value to label.
 * @returns {string} The label for the object value.
 *
 * Example usage:
 *   getObjectLabelValue({}); // 'plain object'
 *   getObjectLabelValue([]); // 'array'
 *   getObjectLabelValue(new Date()); // 'Date'
 *   getObjectLabelValue(/abc/); // 'RegExp'
 *   getObjectLabelValue({ [Symbol.toStringTag]: 'Custom' }); // 'custom Symbol.toStringTag'
 *   getObjectLabelValue({ toString() { throw new Error('fail'); } }); // 'throws on toString'
 */
export const getObjectLabelValue = (obj: object): string => {
	if (isArray(obj)) return 'array';
	if (isDate(obj)) return 'Date';
	if (isRegExp(obj)) return 'RegExp';
	if (hasCustomToStringTag(obj)) return 'custom Symbol.toStringTag';
	if (throwsOnToString(obj)) return 'throws on toString';
	if (isPlainObject(obj)) return 'plain object';
	return 'object';
};

/**
 * Returns the expected value (boolean) for a given object value for stringability tests.
 * This function is pure and always returns true for any object, including arrays, dates, regexps, etc.
 *
 * @param obj - The object value to check.
 * @returns {boolean} Always true for objects.
 *
 * Example usage:
 *   getObjectExpectedValue({}); // true
 *   getObjectExpectedValue([]); // true
 *   getObjectExpectedValue(new Date()); // true
 *   getObjectExpectedValue(/abc/); // true
 */
export const getObjectExpectedValue = (obj: object): boolean => {
	if (isArray(obj)) return true;
	if (isDate(obj)) return true;
	if (isRegExp(obj)) return true;
	if (hasCustomToStringTag(obj)) return true;
	if (throwsOnToString(obj)) return true;
	if (isPlainObject(obj)) return true;
	return false;
};

/**
 * Returns an array of representative object values (plain object, array, Date, RegExp, custom object).
 * This function is pure and does not mutate any external state.
 *
 * @returns {object[]} An array containing representative object values.
 *
 * Example usage:
 *   const objects = getAllObjectValues();
 *   // [ {}, [], new Date(), /abc/, { [Symbol.toStringTag]: 'Custom' }, { toString() { throw new Error('fail'); } } ]
 */
export const getAllObjectValues = (): object[] => [
	{}, // plain object
	[], // array
	new Date(), // Date
	/abc/, // RegExp
	{ [Symbol.toStringTag]: 'Custom' }, // custom object with Symbol.toStringTag
	{
		toString() {
			throw new Error('fail');
		},
	}, // object that throws on String conversion
];

/**
 * Maps all object values to their string labels using getObjectLabelValue.
 * This function is pure and composes getAllObjectValues and getObjectLabelValue.
 *
 * @returns {string[]} An array of string labels for each object value.
 *
 * Example usage:
 *   getAllObjectLabelValues();
 *   // ['plain object', 'array', 'Date', 'RegExp', 'custom Symbol.toStringTag', 'throws on toString']
 */
export const getAllObjectLabelValues = (): string[] => getAllObjectValues().map(getObjectLabelValue);

/**
 * Maps all object values to their expected boolean values using getObjectExpectedValue.
 * This function is pure and composes getAllObjectValues and getObjectExpectedValue.
 *
 * @returns {boolean[]} An array of expected boolean values for each object value.
 *
 * Example usage:
 *   getObjectExpectedValues();
 *   // [true, true, ...]
 */
export const getAllObjectExpectedValues = (): boolean[] => getAllObjectValues().map(getObjectExpectedValue);
