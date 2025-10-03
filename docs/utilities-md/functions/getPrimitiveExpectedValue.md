[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getPrimitiveExpectedValue

# Function: getPrimitiveExpectedValue()

> **getPrimitiveExpectedValue**(`value`): `boolean`

Defined in: [helper-functions/primitive.utils.ts:46](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/primitive.utils.ts#L46)

Returns the expected value (boolean) for a given primitive value for stringability tests.
This function is pure and always returns true for all JavaScript primitive types.

## Parameters

### value

`unknown`

The primitive value to check.

## Returns

`boolean`

Always true for primitives.

Example usage:
  getPrimitiveExpectedValue(42); // true
  getPrimitiveExpectedValue(null); // true
