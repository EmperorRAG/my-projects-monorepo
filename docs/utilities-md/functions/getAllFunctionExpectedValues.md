[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getAllFunctionExpectedValues

# Function: getAllFunctionExpectedValues()

> **getAllFunctionExpectedValues**(): `boolean`[]

Defined in: [helper-functions/function.utils.ts:81](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/function.utils.ts#L81)

Maps all function values to their expected boolean values using getFunctionExpectedValue.
This function is pure and composes getAllFunctionValues and getFunctionExpectedValue.

## Returns

`boolean`[]

An array of expected boolean values for each function value.

Example usage:
  getFunctionExpectedValues();
  // [true, true]
