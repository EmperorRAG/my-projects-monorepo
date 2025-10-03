[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / toObjects

# Function: toObjects()

> **toObjects**\<`K`, `T`\>(`propertyName`, `values`): `Record`\<`K`, `T`\>[]

Defined in: [helper-functions/toObjects.utils.ts:14](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/toObjects.utils.ts#L14)

Converts an array of values into an array of objects, where each object has one property
with the property name provided as input and its value being the corresponding value from the array.
This function is pure and does not mutate any external state.

## Type Parameters

### K

`K` *extends* `string`

### T

`T`

## Parameters

### propertyName

`K`

The property name to use for each object.

### values

`T`[]

The array of values to convert.

## Returns

`Record`\<`K`, `T`\>[]

An array of objects with the specified property name and values.

Example usage:
  toObjects('input', [1, 2, 3]);
  // [ { input: 1 }, { input: 2 }, { input: 3 } ]
