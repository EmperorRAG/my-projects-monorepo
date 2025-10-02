/**
 * Combines two arrays of objects into a single array of objects, merging each pair of objects by index.
 * The resulting array has objects with the combined properties of both input types.
 *
 * @param arr1 - The first array of objects.
 * @param arr2 - The second array of objects.
 * @returns {(T & U)[]} An array of objects with merged properties from both arrays.
 *
 * Example usage:
 *   mergeObjects([{ a: 1 }], [{ b: 2 }]); // [{ a: 1, b: 2 }]
 */
export function mergeObjects<T extends object, U extends object>(arr1: T[], arr2: U[]): (T & U)[] {
	const minLength = Math.min(arr1.length, arr2.length);
	return Array.from({ length: minLength }, (_, i) => ({ ...arr1[i], ...arr2[i] }));
}
