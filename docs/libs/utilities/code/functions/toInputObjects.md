[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / toInputObjects

# Function: toInputObjects()

> **toInputObjects**\<`T`\>(`values`): `object`[]

Defined in: [helper-functions/toObjects.utils.ts:28](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/toObjects.utils.ts#L28)

Converts an array of values into an array of objects with the property name 'input'.
This is a curried version of toObjects with propertyName preset to 'input'.

## Type Parameters

### T

`T`

## Parameters

### values

`T`[]

The array of values to convert.

## Returns

`object`[]

An array of objects with the property 'input' and corresponding values.

Example usage:
  toInputObjects([1, 2, 3]);
  // [ { input: 1 }, { input: 2 }, { input: 3 } ]
