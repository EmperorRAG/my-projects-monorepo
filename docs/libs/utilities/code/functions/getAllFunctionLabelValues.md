[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getAllFunctionLabelValues

# Function: getAllFunctionLabelValues()

> **getAllFunctionLabelValues**(): `string`[]

Defined in: [helper-functions/function.utils.ts:69](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/function.utils.ts#L69)

Maps all function values to their string labels using getFunctionLabelValue.
This function is pure and composes getAllFunctionValues and getFunctionLabelValue.

## Returns

`string`[]

An array of string labels for each function value.

Example usage:
  getAllFunctionLabelValues();
  // ['arrow function', 'named function']
