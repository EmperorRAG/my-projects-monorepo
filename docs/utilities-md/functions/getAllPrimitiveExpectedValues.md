[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getAllPrimitiveExpectedValues

# Function: getAllPrimitiveExpectedValues()

> **getAllPrimitiveExpectedValues**(): `boolean`[]

Defined in: [helper-functions/primitive.utils.ts:99](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/primitive.utils.ts#L99)

Maps all primitive values to their expected boolean values using getPrimitiveExpectedValue.
This function is pure and composes getAllPrimitiveValues and getPrimitiveExpectedValue.

## Returns

`boolean`[]

An array of expected boolean values for each primitive value.

Example usage:
  getPrimitiveExpectedValues();
  // [true, true, ...]
