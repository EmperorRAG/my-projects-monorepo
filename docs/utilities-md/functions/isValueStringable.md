[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / isValueStringable

# Function: isValueStringable()

> **isValueStringable**(`value`): `value is Stringable`

Defined in: [types/stringable/stringable.types.ts:53](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/types/stringable/stringable.types.ts#L53)

Determines if a value can be safely passed to String() without throwing.

## Acceptance Criteria
- Returns true for all primitive types: string, number, boolean, bigint, symbol, undefined, and null.
- Returns true for objects (including arrays, plain objects, Date, RegExp, etc.).
- Returns true for functions.
- Returns true for values with custom Symbol.toStringTag (unless they throw on String conversion).
- Returns false only if the value throws when passed to String().

## Parameters

### value

`unknown`

## Returns

`value is Stringable`

True if the value can be safely converted to a string

## Example

```ts
// Primitives
isValueStringable("test"); // true
isValueStringable(42); // true
isValueStringable(true); // true
isValueStringable(undefined); // true
isValueStringable(null); // true
isValueStringable(Symbol("sym")); // true
isValueStringable(123n); // true

// Objects
isValueStringable({}); // true
isValueStringable([]); // true
isValueStringable(new Date()); // true
isValueStringable(/abc/); // true

// Functions
isValueStringable(() => {}); // true

// Custom object with Symbol.toStringTag
const obj = { [Symbol.toStringTag]: "Custom" };
isValueStringable(obj); // true

// Value that throws on String conversion (rare)
// const throwingObj = { toString() { throw new Error("fail"); } };
// isValueStringable(throwingObj); // true (but String(throwingObj) would throw)
```
