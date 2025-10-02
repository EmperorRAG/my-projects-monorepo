/**
 * Converts an array of values into an array of objects, where each object has one property
 * with the property name provided as input and its value being the corresponding value from the array.
 * This function is pure and does not mutate any external state.
 *
 * @param propertyName - The property name to use for each object.
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the specified property name and values.
 *
 * Example usage:
 *   toObjects('input', [1, 2, 3]);
 *   // [ { input: 1 }, { input: 2 }, { input: 3 } ]
 */
export const toObjects = <K extends string, T>(propertyName: K, values: T[]): Record<K, T>[] =>
	values.map((value) => ({ [propertyName]: value }) as Record<K, T>);

/**
 * Converts an array of values into an array of objects with the property name 'input'.
 * This is a curried version of toObjects with propertyName preset to 'input'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'input' and corresponding values.
 *
 * Example usage:
 *   toInputObjects([1, 2, 3]);
 *   // [ { input: 1 }, { input: 2 }, { input: 3 } ]
 */
export const toInputObjects = <T>(values: T[]): { input: T }[] => toObjects<'input', T>('input', values);

/**
 * Converts an array of values into an array of objects with the property name 'label'.
 * This is a curried version of toObjects with propertyName preset to 'label'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'label' and corresponding values.
 *
 * Example usage:
 *   toLabelObjects(['foo', 'bar']);
 *   // [ { label: 'foo' }, { label: 'bar' } ]
 */
export const toLabelObjects = <T>(values: T[]): { label: T }[] => toObjects<'label', T>('label', values);

/**
 * Converts an array of values into an array of objects with the property name 'expected'.
 * This is a curried version of toObjects with propertyName preset to 'expected'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'expected' and corresponding values.
 *
 * Example usage:
 *   toExpectedObjects([true, false]);
 *   // [ { expected: true }, { expected: false } ]
 */
export const toExpectedObjects = <T>(values: T[]): { expected: T }[] => toObjects<'expected', T>('expected', values);

/**
 * Converts an array of values into an array of objects with the property name 'name'.
 * This is a curried version of toObjects with propertyName preset to 'name'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'name' and corresponding values.
 */
export const toNameObjects = <T>(values: T[]): { name: T }[] => toObjects<'name', T>('name', values);

/**
 * Converts an array of values into an array of objects with the property name 'value'.
 * This is a curried version of toObjects with propertyName preset to 'value'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'value' and corresponding values.
 */
export const toValueObjects = <T>(values: T[]): { value: T }[] => toObjects<'value', T>('value', values);

/**
 * Converts an array of values into an array of objects with the property name 'key'.
 * This is a curried version of toObjects with propertyName preset to 'key'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'key' and corresponding values.
 */
export const toKeyObjects = <T>(values: T[]): { key: T }[] => toObjects<'key', T>('key', values);

/**
 * Converts an array of values into an array of objects with the property name 'options'.
 * This is a curried version of toObjects with propertyName preset to 'options'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'options' and corresponding values.
 */
export const toOptionsObjects = <T>(values: T[]): { options: T }[] => toObjects<'options', T>('options', values);

/**
 * Converts an array of values into an array of objects with the property name 'defaultValue'.
 * This is a curried version of toObjects with propertyName preset to 'defaultValue'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'defaultValue' and corresponding values.
 */
export const toDefaultValueObjects = <T>(values: T[]): { defaultValue: T }[] => toObjects<'defaultValue', T>('defaultValue', values);

/**
 * Converts an array of values into an array of objects with the property name 'placeholder'.
 * This is a curried version of toObjects with propertyName preset to 'placeholder'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'placeholder' and corresponding values.
 *
 * Example usage:
 *   toPlaceholderObjects(['foo', 'bar']);
 *   // [ { placeholder: 'foo' }, { placeholder: 'bar' } ]
 */
export const toPlaceholderObjects = <T>(values: T[]): { placeholder: T }[] => toObjects<'placeholder', T>('placeholder', values);

/**
 * Converts an array of values into an array of objects with the property name 'min'.
 * This is a curried version of toObjects with propertyName preset to 'min'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'min' and corresponding values.
 */
export const toMinObjects = <T>(values: T[]): { min: T }[] => toObjects<'min', T>('min', values);

/**
 * Converts an array of values into an array of objects with the property name 'max'.
 * This is a curried version of toObjects with propertyName preset to 'max'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'max' and corresponding values.
 */
export const toMaxObjects = <T>(values: T[]): { max: T }[] => toObjects<'max', T>('max', values);

/**
 * Converts an array of values into an array of objects with the property name 'required'.
 * This is a curried version of toObjects with propertyName preset to 'required'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'required' and corresponding values.
 */
export const toRequiredObjects = <T>(values: T[]): { required: T }[] => toObjects<'required', T>('required', values);

/**
 * Converts an array of values into an array of objects with the property name 'columns'.
 * This is a curried version of toObjects with propertyName preset to 'columns'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'columns' and corresponding values.
 */
export const toColumnsObjects = <T>(values: T[]): { columns: T }[] => toObjects<'columns', T>('columns', values);

/**
 * Converts an array of values into an array of objects with the property name 'description'.
 * This is a curried version of toObjects with propertyName preset to 'description'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'description' and corresponding values.
 */
export const toDescriptionObjects = <T>(values: T[]): { description: T }[] => toObjects<'description', T>('description', values);

/**
 * Converts an array of values into an array of objects with the property name 'styles'.
 * This is a curried version of toObjects with propertyName preset to 'styles'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'styles' and corresponding values.
 */
export const toStylesObjects = <T>(values: T[]): { styles: T }[] => toObjects<'styles', T>('styles', values);

/**
 * Converts an array of values into an array of objects with the property name 'id'.
 * This is a curried version of toObjects with propertyName preset to 'id'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'id' and corresponding values.
 */
export const toIdObjects = <T>(values: T[]): { id: T }[] => toObjects<'id', T>('id', values);

/**
 * Converts an array of values into an array of objects with the property name 'formId'.
 * This is a curried version of toObjects with propertyName preset to 'formId'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'formId' and corresponding values.
 */
export const toFormIdObjects = <T>(values: T[]): { formId: T }[] => toObjects<'formId', T>('formId', values);

/**
 * Converts an array of values into an array of objects with the property name 'errorId'.
 * This is a curried version of toObjects with propertyName preset to 'errorId'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'errorId' and corresponding values.
 */
export const toErrorIdObjects = <T>(values: T[]): { errorId: T }[] => toObjects<'errorId', T>('errorId', values);

/**
 * Converts an array of values into an array of objects with the property name 'valid'.
 * This is a curried version of toObjects with propertyName preset to 'valid'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'valid' and corresponding values.
 */
export const toValidObjects = <T>(values: T[]): { valid: T }[] => toObjects<'valid', T>('valid', values);

/**
 * Converts an array of values into an array of objects with the property name 'defaultChecked'.
 * This is a curried version of toObjects with propertyName preset to 'defaultChecked'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'defaultChecked' and corresponding values.
 */
export const toDefaultCheckedObjects = <T>(values: T[]): { defaultChecked: T }[] => toObjects<'defaultChecked', T>('defaultChecked', values);

/**
 * Converts an array of values into an array of objects with the property name 'multiple'.
 * This is a curried version of toObjects with propertyName preset to 'multiple'.
 *
 * @param values - The array of values to convert.
 * @returns {object[]} An array of objects with the property 'multiple' and corresponding values.
 */
export const toMultipleObjects = <T>(values: T[]): { multiple: T }[] => toObjects<'multiple', T>('multiple', values);
