[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / toLabelObjects

# Function: toLabelObjects()

> **toLabelObjects**\<`T`\>(`values`): `object`[]

Defined in: [helper-functions/toObjects.utils.ts:41](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/toObjects.utils.ts#L41)

Converts an array of values into an array of objects with the property name 'label'.
This is a curried version of toObjects with propertyName preset to 'label'.

## Type Parameters

### T

`T`

## Parameters

### values

`T`[]

The array of values to convert.

## Returns

`object`[]

An array of objects with the property 'label' and corresponding values.

Example usage:
  toLabelObjects(['foo', 'bar']);
  // [ { label: 'foo' }, { label: 'bar' } ]
