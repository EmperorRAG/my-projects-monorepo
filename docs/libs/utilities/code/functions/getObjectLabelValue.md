[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getObjectLabelValue

# Function: getObjectLabelValue()

> **getObjectLabelValue**(`obj`): `string`

Defined in: [helper-functions/object.utils.ts:18](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/object.utils.ts#L18)

Returns a string label describing the object value's type.
This function is pure and does not mutate any external state.

## Parameters

### obj

`object`

The object value to label.

## Returns

`string`

The label for the object value.

Example usage:
  getObjectLabelValue({}); // 'plain object'
  getObjectLabelValue([]); // 'array'
  getObjectLabelValue(new Date()); // 'Date'
  getObjectLabelValue(/abc/); // 'RegExp'
  getObjectLabelValue({ [Symbol.toStringTag]: 'Custom' }); // 'custom Symbol.toStringTag'
  getObjectLabelValue({ toString() { throw new Error('fail'); } }); // 'throws on toString'
