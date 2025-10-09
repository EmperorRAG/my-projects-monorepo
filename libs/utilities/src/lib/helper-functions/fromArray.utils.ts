import { pipe } from 'effect';
import * as Array from 'effect/Array';
import * as Option from 'effect/Option';

/**
 * Safely extracts the first element from an array.
 *
 * @pure This function is pure and does not have side effects.
 * @description Takes an array and returns an Option containing the first element if the array is not empty,
 * or None if the array is empty.
 *
 * @fp-pattern Accessor
 * @composition Uses `Array.head` from the `effect` library.
 *
 * @param arr - The array to extract the first element from.
 * @returns {Option.Option<T>} An `Option` of the first element.
 *
 * @example
 * import * as Option from 'effect/Option';
 * import { fromArray } from './fromArray.utils';
 *
 * const result1 = fromArray([1, 2, 3]);
 * // => Option.some(1)
 *
 * const result2 = fromArray([]);
 * // => Option.none()
 */
export const fromArray = <T>(arr: T[]): Option.Option<T> => pipe(arr, Array.head);
