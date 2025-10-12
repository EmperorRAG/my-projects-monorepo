[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getAllObjectLabelValues

# Function: getAllObjectLabelValues()

> **getAllObjectLabelValues**(): `string`[]

Defined in: [helper-functions/object.utils.ts:84](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/object.utils.ts#L84)

Maps all object values to their string labels using getObjectLabelValue.
This function is pure and composes getAllObjectValues and getObjectLabelValue.

## Returns

`string`[]

An array of string labels for each object value.

Example usage:
  getAllObjectLabelValues();
  // ['plain object', 'array', 'Date', 'RegExp', 'custom Symbol.toStringTag', 'throws on toString']
