[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / toDefaultCheckedObjects

# Function: toDefaultCheckedObjects()

> **toDefaultCheckedObjects**\<`T`\>(`values`): `object`[]

Defined in: [helper-functions/toObjects.utils.ts:211](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/toObjects.utils.ts#L211)

Converts an array of values into an array of objects with the property name 'defaultChecked'.
This is a curried version of toObjects with propertyName preset to 'defaultChecked'.

## Type Parameters

### T

`T`

## Parameters

### values

`T`[]

The array of values to convert.

## Returns

`object`[]

An array of objects with the property 'defaultChecked' and corresponding values.
