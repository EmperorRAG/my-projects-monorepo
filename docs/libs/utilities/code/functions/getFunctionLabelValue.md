[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getFunctionLabelValue

# Function: getFunctionLabelValue()

> **getFunctionLabelValue**(`fn`): `string`

Defined in: [helper-functions/function.utils.ts:15](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/function.utils.ts#L15)

Returns a string label describing the function value's type.
This function is pure and does not mutate any external state.

## Parameters

### fn

`Function`

The function value to label.

## Returns

`string`

The label for the function value.

Example usage:
  getFunctionLabelValue(() => {}); // 'arrow function'
  getFunctionLabelValue(function namedFunc() {}); // 'named function'
