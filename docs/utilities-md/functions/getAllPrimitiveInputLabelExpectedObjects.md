[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getAllPrimitiveInputLabelExpectedObjects

# Function: getAllPrimitiveInputLabelExpectedObjects()

> **getAllPrimitiveInputLabelExpectedObjects**(): `object` & `object` & `object`[]

Defined in: [types/stringable/stringable.fixtures.ts:17](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/types/stringable/stringable.fixtures.ts#L17)

Generates an array of expected objects for all primitive input-label combinations.

This function combines arrays of input objects, label objects, and expected value objects
for all primitive values using the `mergeObjects` utility. The resulting array
conforms to the `InputLabelExpected[]` type.

## Returns

`object` & `object` & `object`[]

An array of objects representing all primitive input-label-expected combinations.
