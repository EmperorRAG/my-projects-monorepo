import { pipe } from 'effect';
import { map } from 'effect/Array';

/**
 * @pure
 * @description Converts an array of values into an array of objects, where each object has a specified property name.
 * This is a higher-order function that takes a property name and returns a new function that processes the values.
 *
 * @fp-pattern Higher-order function, Curried function
 *
 * @param propertyName - The property name to use for each object.
 * @returns A function that takes an array of values and returns an array of objects.
 *
 * @example
 * const toIdObjects = toObjects('id');
 * const result = toIdObjects([1, 2, 3]);
 * // => [ { id: 1 }, { id: 2 }, { id: 3 } ]
 */
export const toObjects =
	<K extends string>(propertyName: K) =>
	<T>(values: T[]): Record<K, T>[] =>
		pipe(
			values,
			map((value) => ({ [propertyName]: value }) as Record<K, T>)
		);

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'input'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('input')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'input' property.
 *
 * @example
 * const result = toInputObjects([1, 2, 3]);
 * // => [ { input: 1 }, { input: 2 }, { input: 3 } ]
 */
export const toInputObjects = toObjects('input');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'label'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('label')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'label' property.
 *
 * @example
 * const result = toLabelObjects(['foo', 'bar']);
 * // => [ { label: 'foo' }, { label: 'bar' } ]
 */
export const toLabelObjects = toObjects('label');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'expected'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('expected')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'expected' property.
 *
 * @example
 * const result = toExpectedObjects([true, false]);
 * // => [ { expected: true }, { expected: false } ]
 */
export const toExpectedObjects = toObjects('expected');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'name'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('name')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'name' property.
 */
export const toNameObjects = toObjects('name');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'value'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('value')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'value' property.
 */
export const toValueObjects = toObjects('value');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'key'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('key')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'key' property.
 */
export const toKeyObjects = toObjects('key');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'options'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('options')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'options' property.
 */
export const toOptionsObjects = toObjects('options');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'defaultValue'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('defaultValue')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'defaultValue' property.
 */
export const toDefaultValueObjects = toObjects('defaultValue');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'placeholder'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('placeholder')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'placeholder' property.
 *
 * @example
 * const result = toPlaceholderObjects(['foo', 'bar']);
 * // => [ { placeholder: 'foo' }, { placeholder: 'bar' } ]
 */
export const toPlaceholderObjects = toObjects('placeholder');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'min'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('min')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'min' property.
 */
export const toMinObjects = toObjects('min');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'max'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('max')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'max' property.
 */
export const toMaxObjects = toObjects('max');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'required'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('required')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'required' property.
 */
export const toRequiredObjects = toObjects('required');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'columns'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('columns')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'columns' property.
 */
export const toColumnsObjects = toObjects('columns');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'description'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('description')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'description' property.
 */
export const toDescriptionObjects = toObjects('description');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'styles'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('styles')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'styles' property.
 */
export const toStylesObjects = toObjects('styles');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'id'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('id')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'id' property.
 */
export const toIdObjects = toObjects('id');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'formId'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('formId')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'formId' property.
 */
export const toFormIdObjects = toObjects('formId');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'errorId'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('errorId')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'errorId' property.
 */
export const toErrorIdObjects = toObjects('errorId');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'valid'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('valid')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'valid' property.
 */
export const toValidObjects = toObjects('valid');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'defaultChecked'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('defaultChecked')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'defaultChecked' property.
 */
export const toDefaultCheckedObjects = toObjects('defaultChecked');

/**
 * @pure
 * @description Converts an array of values into an array of objects with the property name 'multiple'.
 * This is a specialized version of `toObjects`.
 *
 * @fp-pattern Curried function
 * @composition
 * - `toObjects('multiple')`
 *
 * @returns A function that takes an array of values and returns an array of objects with the 'multiple' property.
 */
export const toMultipleObjects = toObjects('multiple');
