[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / mergeObjects

# Function: mergeObjects()

> **mergeObjects**\<`T`, `U`\>(`arr1`, `arr2`): `T` & `U`[]

Defined in: [helper-functions/mergeObjects.utils.ts:12](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/mergeObjects.utils.ts#L12)

Combines two arrays of objects into a single array of objects, merging each pair of objects by index.
The resulting array has objects with the combined properties of both input types.

## Type Parameters

### T

`T` *extends* `object`

### U

`U` *extends* `object`

## Parameters

### arr1

`T`[]

The first array of objects.

### arr2

`U`[]

The second array of objects.

## Returns

`T` & `U`[]

An array of objects with merged properties from both arrays.

Example usage:
  mergeObjects([{ a: 1 }], [{ b: 2 }]); // [{ a: 1, b: 2 }]
