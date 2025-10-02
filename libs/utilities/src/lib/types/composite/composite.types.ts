import { isValueNumber } from '../number/number.types';
import { isValueString } from '../string/string.types';

export function isValueStringOrNumber(value: unknown): value is string | number {
	return isValueString(value) || isValueNumber(value);
}
