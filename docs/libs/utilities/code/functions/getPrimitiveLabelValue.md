[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getPrimitiveLabelValue

# Function: getPrimitiveLabelValue()

> **getPrimitiveLabelValue**(`value`): `string`

Defined in: [helper-functions/primitive.utils.ts:24](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/primitive.utils.ts#L24)

Returns a string label describing the primitive value's type.
This function is pure and does not mutate any external state.

## Parameters

### value

`unknown`

The primitive value to label.

## Returns

`string`

The label for the primitive value.

Example usage:
  getPrimitiveLabelValue(42); // 'number'
  getPrimitiveLabelValue(null); // 'null'
  getPrimitiveLabelValue(Symbol('sym')); // 'symbol'
