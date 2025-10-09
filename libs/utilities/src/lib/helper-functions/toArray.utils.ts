import { pipe } from 'effect';
import { of } from 'effect/Array';

/**
 * Wraps a value in an array.
 *
 * @pure This function is pure and does not have side effects.
 * @description Takes a value of any type and returns an array containing that single value.
 *
 * @fp-pattern Functor (`of`)
 * @composition Uses `of` from `effect/Array` to lift a value into an array context.
 *
 * @param value - The value to wrap in an array.
 * @returns {T[]} An array containing the given value.
 *
 * @example
 * const result = toArray(42);
 * // => [42]
 */
export const toArray = <T>(value: T): T[] => pipe(value, of);
