[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getAllObjectValues

# Function: getAllObjectValues()

> **getAllObjectValues**(): `object`[]

Defined in: [helper-functions/object.utils.ts:61](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/object.utils.ts#L61)

Returns an array of representative object values (plain object, array, Date, RegExp, custom object).
This function is pure and does not mutate any external state.

## Returns

`object`[]

An array containing representative object values.

Example usage:
  const objects = getAllObjectValues();
  // [ {}, [], new Date(), /abc/, { [Symbol.toStringTag]: 'Custom' }, { toString() { throw new Error('fail'); } } ]
