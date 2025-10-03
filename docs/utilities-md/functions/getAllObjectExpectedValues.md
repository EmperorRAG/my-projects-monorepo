[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getAllObjectExpectedValues

# Function: getAllObjectExpectedValues()

> **getAllObjectExpectedValues**(): `boolean`[]

Defined in: [helper-functions/object.utils.ts:96](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/object.utils.ts#L96)

Maps all object values to their expected boolean values using getObjectExpectedValue.
This function is pure and composes getAllObjectValues and getObjectExpectedValue.

## Returns

`boolean`[]

An array of expected boolean values for each object value.

Example usage:
  getObjectExpectedValues();
  // [true, true, ...]
