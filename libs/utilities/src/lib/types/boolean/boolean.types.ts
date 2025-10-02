import { isBoolean } from '../primitive.types';

export function isValueBoolean(value: unknown): value is boolean {
	return isBoolean(value);
}
