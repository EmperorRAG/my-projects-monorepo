[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / isValueArrayOf

# Function: isValueArrayOf()

> **isValueArrayOf**\<`T`\>(`value`, `valueGuard`): `value is T[]`

Defined in: [types/array/array.types.ts:20](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/types/array/array.types.ts#L20)

Type guard to check if a value is an array of T, using a provided valueGuard.

## Type Parameters

### T

`T`

## Parameters

### value

`unknown`

The value to check.

### valueGuard

(`v`) => `v is T`

The type guard for the array element type.

## Returns

`value is T[]`

True if value is an array and every element passes valueGuard.
