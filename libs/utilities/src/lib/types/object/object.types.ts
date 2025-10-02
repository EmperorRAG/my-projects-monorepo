/**
 * Checks if the given value is an object (and not null).
 * @param value - The value to check.
 * @returns {boolean} True if value is a non-null object.
 */
export const isValueObject = (value: unknown): value is object => {
	return typeof value === 'object' && value !== null;
};
