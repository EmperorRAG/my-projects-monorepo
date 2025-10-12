[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / isValuePrimitiveStringable

# Function: isValuePrimitiveStringable()

> **isValuePrimitiveStringable**(`value`): `value is PrimitiveStringable`

Defined in: [types/stringable/stringable.types.ts:91](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/types/stringable/stringable.types.ts#L91)

Determines if a value is a primitive that can be safely passed to String().

## Acceptance Criteria
- Returns true for all primitive types: string, number, boolean, bigint, symbol, undefined, and null.
- Returns false for objects and functions.

## Parameters

### value

`unknown`

The value to check

## Returns

`value is PrimitiveStringable`

True if the value is a primitive that can be safely converted to a string

## Example

```ts
isValuePrimitiveStringable("test"); // true
isValuePrimitiveStringable(42); // true
isValuePrimitiveStringable(true); // true
isValuePrimitiveStringable(undefined); // true
isValuePrimitiveStringable(null); // true
isValuePrimitiveStringable(Symbol("sym")); // true
isValuePrimitiveStringable(123n); // true
isValuePrimitiveStringable({}); // false
isValuePrimitiveStringable([]); // false
isValuePrimitiveStringable(() => {}); // false
```
