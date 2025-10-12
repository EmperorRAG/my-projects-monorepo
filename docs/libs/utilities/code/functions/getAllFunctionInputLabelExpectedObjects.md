[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getAllFunctionInputLabelExpectedObjects

# Function: getAllFunctionInputLabelExpectedObjects()

> **getAllFunctionInputLabelExpectedObjects**(): `object` & `object` & `object`[]

Defined in: [types/stringable/stringable.fixtures.ts:31](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/types/stringable/stringable.fixtures.ts#L31)

Generates an array of objects that combine input, label, and expected value representations
for all function values, labels, and expected results. This is achieved by converting each
set of values into their respective object arrays and merging them using `mergeObjects`.
The resulting array conforms to the `InputLabelExpected[]` type.

## Returns

`object` & `object` & `object`[]

An array of objects containing input, label, and expected value data.
