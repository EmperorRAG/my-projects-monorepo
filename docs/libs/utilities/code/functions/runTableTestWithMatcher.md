[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / runTableTestWithMatcher

# Function: runTableTestWithMatcher()

> **runTableTestWithMatcher**\<`Input`, `Expected`\>(`fn`): (`matcher`) => (`description`, `cases`) => `void`

Defined in: [helper-functions/runTableTest.utils.ts:17](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/runTableTest.utils.ts#L17)

Jest table-driven test runner for evaluating any function with a customizable matcher.

## Type Parameters

### Input

`Input`

### Expected

`Expected`

## Parameters

### fn

(`input`) => `Expected`

The function to test.

## Returns

Curried function accepting matcher, then description and cases.

> (`matcher`): (`description`, `cases`) => `void`

### Parameters

#### matcher

(`result`, `expected`) => `void`

### Returns

> (`description`, `cases`): `void`

#### Parameters

##### description

`string`

##### cases

`object`[]

#### Returns

`void`

## Example

```ts
const runJestTableTest = runJestTableTestWithMatcher(IsValueStringable);
runJestTableTest((result, expected) => jestExpect(result).toBe(expected))('Test primitives', [
  { input: 'foo', expected: true, label: 'string' },
  { input: 123, expected: true, label: 'number' },
]);
```
