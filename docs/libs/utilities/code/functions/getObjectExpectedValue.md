[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / getObjectExpectedValue

# Function: getObjectExpectedValue()

> **getObjectExpectedValue**(`obj`): `boolean`

Defined in: [helper-functions/object.utils.ts:41](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/object.utils.ts#L41)

Returns the expected value (boolean) for a given object value for stringability tests.
This function is pure and always returns true for any object, including arrays, dates, regexps, etc.

## Parameters

### obj

`object`

The object value to check.

## Returns

`boolean`

Always true for objects.

Example usage:
  getObjectExpectedValue({}); // true
  getObjectExpectedValue([]); // true
  getObjectExpectedValue(new Date()); // true
  getObjectExpectedValue(/abc/); // true
