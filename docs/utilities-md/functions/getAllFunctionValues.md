[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getAllFunctionValues

# Function: getAllFunctionValues()

> **getAllFunctionValues**(): `Function`[]

Defined in: [helper-functions/function.utils.ts:50](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/function.utils.ts#L50)

Returns an array of representative function values (arrow and named functions).
This function is pure and does not mutate any external state.

## Returns

`Function`[]

An array containing representative function values.

Example usage:
  const functions = getAllFunctionValues();
  // [() => {}, function namedFunc() {}]
