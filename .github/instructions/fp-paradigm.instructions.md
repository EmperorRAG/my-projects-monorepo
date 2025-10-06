---
description: 'Functional Programming paradigm guidelines for TypeScript using Effect-TS'
applyTo: '**/*.ts'
---

# Functional Programming Paradigm with Effect-TS

You are an expert in functional programming (FP) in TypeScript, specifically using the `effect` library. Your primary goal is to write code that is pure, immutable, and composable.

## Core Principles

### Purity
- All exported functions MUST be pure. They must not have any observable side effects.
- A function is pure if, given the same input, it always returns the same output and does not modify any external state.
- You MUST explicitly mark pure functions with a `@pure` tag in their JSDoc block.
- If a function is impure (e.g., logging, network requests), it MUST be wrapped in an `Effect`.

### Immutability
- You MUST NEVER mutate input parameters or global state.
- Always use `const` for variable declarations unless a mutable binding is unavoidable.
- You MUST return new data structures (objects, arrays) instead of modifying existing ones.

### Function Composition
- You MUST use `pipe()` from the `effect` library for composing multiple functions. This is the standard for left-to-right data flow.
- You MUST document the composition chain in the JSDoc for complex pipelines.
- AVOID method chaining (e.g., `array.map(...).filter(...)`) in favor of `pipe(array, map(...), filter(...))`.

### Conditional Logic
- You MUST use the `Match` module from `effect` for conditional logic instead of `if/else` or `switch` statements. This provides type-safe, declarative pattern matching.

### Currying & Partial Application
- You MUST order parameters to support partial application (data-last).
- You WILL use currying to create specialized, reusable functions from more generic ones.
- You MUST document the signature of curried functions in JSDoc.

## Required Function Patterns

### Arrow Functions with `const` Export
All exported functions MUST be defined as nameless arrow functions and exported with `const`.

```typescript
// ✅ CORRECT: Nameless arrow function with const export
export const functionName = (param: Type): ReturnType => {
  // implementation
};

// ❌ AVOID: `function` declarations for exports
export function functionName(param: Type): ReturnType {
  // implementation
}
```

### `pipe` for Composition
Use `pipe` to create clear, sequential data pipelines.

```typescript
import { pipe } from 'effect';
import { map } from 'effect/Array';
import { getAllFunctionValues, getFunctionLabelValue } from './function.utils';

/**
 * @pure
 * @description Maps all function values to their string labels.
 * @composition Composes `getAllFunctionValues` with `map(getFunctionLabelValue)`.
 */
export const getAllFunctionLabelValues = (): string[] =>
  pipe(
    getAllFunctionValues(),
    map(getFunctionLabelValue)
  );
```

### `Match` for Pattern Matching
Use `Match` to replace imperative conditional blocks.

```typescript
import { Match } from 'effect';
import { isNull, isBigInt, isSymbol, isString, isNumber, isBoolean, isUndefined } from './primitive.utils';
import { getTypeOf } from './primitive.utils';

/**
 * @pure
 * @description Gets the string label for a primitive value using pattern matching.
 */
export const getPrimitiveLabelValue = (value: unknown): string =>
  Match.value(value).pipe(
    Match.when(isNull, () => 'null'),
    Match.when(isBigInt, () => 'bigint'),
    Match.when(isSymbol, () => 'symbol'),
    Match.when(isString, () => 'string'),
    Match.when(isNumber, () => 'number'),
    Match.when(isBoolean, () => 'boolean'),
    Match.when(isUndefined, () => 'undefined'),
    Match.orElse(getTypeOf)
  );
```

## Documentation Standards

### JSDoc Template for Pure Functions
You MUST use this JSDoc template for all exported pure functions.

```typescript
/**
 * A brief, imperative description of what the function does.
 *
 * @pure This tag is mandatory for all pure functions.
 * @description A more detailed explanation if necessary.
 *
 * @fp-pattern Describes the FP pattern used (e.g., "Higher-order function", "Curried function").
 * @composition Documents the chain of functions for `pipe`.
 *   - `pipe(fn1, fn2, fn3)`
 *
 * @param name - Description of the parameter.
 * @returns {ReturnType} Description of the return value.
 *
 * @example
 * // A clear, simple example of how to use the function.
 * const result = functionName(input);
 * // => expected output
 */
```

## Anti-Patterns to Avoid

### ❌ Mutation
```typescript
// BAD: Mutates the input array.
const addItem = (arr: T[], item: T) => {
  arr.push(item);
  return arr;
};

// GOOD: Returns a new array, preserving immutability.
const addItem = (arr: T[], item: T): T[] => [...arr, item];
```

### ❌ If-Else / Switch Statements
```typescript
// BAD: Imperative if-else pyramid.
const getLabel = (value: unknown): string => {
  if (isNull(value)) {
    return 'null';
  } else if (isString(value)) {
    return 'string';
  } else {
    return 'unknown';
  }
};

// GOOD: Declarative pattern matching with `Match`.
const getLabel = (value: unknown): string =>
  Match.value(value).pipe(
    Match.when(isNull, () => 'null'),
    Match.when(isString, () => 'string'),
    Match.orElse(() => 'unknown')
  );
```

### ❌ Imperative Loops
```typescript
// BAD: Imperative `for` loop.
const labels = [];
for (let i = 0; i < values.length; i++) {
  labels.push(getLabel(values[i]));
}

// GOOD: Declarative `map` operation, preferably within a `pipe`.
const labels = pipe(values, map(getLabel));
```

## Code Review & Generation Checklist

When generating or reviewing code, you MUST ensure the following:
- [ ] All functions are pure and marked with `@pure`.
- [ ] All exported functions are `const` arrow functions.
- [ ] Immutability is strictly maintained.
- [ ] `pipe()` is used for multi-step transformations.
- [ ] `Match` is used for conditional logic.
- [ ] JSDoc is complete and follows the template.
- [ ] Curried functions use a data-last parameter order.
- [ ] All documented anti-patterns are avoided.
