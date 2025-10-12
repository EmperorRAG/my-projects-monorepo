[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getAllPrimitiveValues

# Function: getAllPrimitiveValues()

> **getAllPrimitiveValues**(): `unknown`[]

Defined in: [helper-functions/primitive.utils.ts:67](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/primitive.utils.ts#L67)

Returns an array of values representative of all JavaScript primitive types.
This function is pure and does not mutate any external state.

## Returns

`unknown`[]

An array containing one value for each primitive type.

Example usage:
  const primitives = getAllPrimitiveValues();
  // ['string', 42, true, undefined, null, Symbol('sym'), 123n]
