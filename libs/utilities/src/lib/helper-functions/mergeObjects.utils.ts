import { pipe } from 'effect';
import { zipWith } from 'effect/Array';

/**
 * Merges two arrays of objects element-wise.
 *
 * @pure This function is pure and does not have side effects.
 * @description A curried function that takes a second array `arr2` and returns a new function.
 * The returned function takes a primary array `arr1` and merges each of its objects with the
 * corresponding object in `arr2`. The merge is shallow.
 *
 * @fp-pattern Curried function, Higher-order function
 * @composition Uses `pipe` with `zipWith` from `effect/Array`.
 *   - `pipe(arr1, zipWith(arr2, (obj1, obj2) => ({ ...obj1, ...obj2 })))`
 *
 * @param arr2 - The second array of objects to merge from.
 * @returns A function that takes the first array `arr1` and returns the merged array.
 *
 * @example
 * const arr1 = [{ a: 1 }, { a: 3 }];
 * const arr2 = [{ b: 2 }, { b: 4 }];
 * const mergeWithArr2 = mergeObjects(arr2);
 * const result = mergeWithArr2(arr1);
 * // => [{ a: 1, b: 2 }, { a: 3, b: 4 }]
 */
export const mergeObjects =
	<U extends object>(arr2: U[]) =>
	<T extends object>(arr1: T[]): (T & U)[] =>
		pipe(
			arr1,
			zipWith(arr2, (a, b) => ({ ...a, ...b }))
		);
