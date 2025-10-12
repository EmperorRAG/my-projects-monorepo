[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getAllPrimitiveLabelValues

# Function: getAllPrimitiveLabelValues()

> **getAllPrimitiveLabelValues**(): `string`[]

Defined in: [helper-functions/primitive.utils.ts:87](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/primitive.utils.ts#L87)

Maps all primitive values to their string labels using getPrimitiveLabelValue.
This function is pure and composes getAllPrimitiveValues and getPrimitiveLabelValue.

## Returns

`string`[]

An array of string labels for each primitive value.

Example usage:
  getAllPrimitiveLabelValues();
  // ['string', 'number', 'boolean', 'undefined', 'null', 'symbol', 'bigint']
