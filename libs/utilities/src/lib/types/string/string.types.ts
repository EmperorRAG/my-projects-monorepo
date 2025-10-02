import { isString } from '../primitive.types';

// Check out how to evaluate for an array of type.
export function isValueString(value: unknown): value is string {
	return isString(value);
}
