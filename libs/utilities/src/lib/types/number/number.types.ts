import { isNumber } from '../primitive.types';

export function isValueNumber(value: unknown): value is number {
	return isNumber(value);
}
