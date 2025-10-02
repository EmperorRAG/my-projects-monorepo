import { isValueArrayOfUnknowns } from '../array/array.types';
import { isValueObject } from '../object/object.types';

export function isValueRecordOfUnknown(value: unknown): value is Record<string, unknown> {
	return isValueObject(value) && !isValueArrayOfUnknowns(value);
}

export function isValueRecordOf<T>(value: unknown, valueGuard: (v: unknown) => v is T): value is Record<string, T> {
	return isValueRecordOfUnknown(value) && Object.values(value).every(valueGuard);
}
