/**
 * Wraps a value in an array.
 * @param value - The value to wrap.
 * @returns {Array<T>} An array containing the value.
 */
export const toArray = <T>(value: T): T[] => [value];
