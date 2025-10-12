[**@emperorrag/utilities**](../README.md)

***

[@emperorrag/utilities](../globals.md) / runExpectToBeTableTest

# Function: runExpectToBeTableTest()

> **runExpectToBeTableTest**\<`Input`, `Expected`\>(`fn`): (`description`, `cases`) => `void`

Defined in: [helper-functions/runTableTest.utils.ts:40](https://github.com/EmperorRAG/my-projects-monorepo/blob/e2bd1d08dbedaf6b4d2837cf58e4e4885a5e09fe/libs/utilities/src/lib/helper-functions/runTableTest.utils.ts#L40)

Jest table-driven test runner for evaluating a function using Jest's `toBe` matcher.

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

Curried function accepting description and cases.

> (`description`, `cases`): `void`

### Parameters

#### description

`string`

#### cases

`object`[]

### Returns

`void`

## Example

```ts
const runJestTableTest = runJestExpectToBeTableTest(IsValueStringable);
runJestTableTest('Test primitives', [
  { input: 'foo', expected: true, label: 'string' },
  { input: 123, expected: true, label: 'number' },
]);
```
