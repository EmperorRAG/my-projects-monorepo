[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getFunctionExpectedValue

# Function: getFunctionExpectedValue()

> **getFunctionExpectedValue**(`fn`): `boolean`

Defined in: [helper-functions/function.utils.ts:33](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/function.utils.ts#L33)

Returns the expected value (boolean) for a given function value for stringability tests.
This function is pure and always returns true for any function.

## Parameters

### fn

`Function`

The function value to check.

## Returns

`boolean`

Always true for functions.

Example usage:
  getFunctionExpectedValue(() => {}); // true
  getFunctionExpectedValue(function namedFunc() {}); // true
