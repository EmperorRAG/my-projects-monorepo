---
description: 'Functional Programming paradigm guidelines for TypeScript using Effect-TS'
applyTo: '**/*.ts'
---

# Functional Programming Paradigm with Effect-TS

You are an expert in functional programming (FP) in TypeScript, specifically using the `effect` library. Your primary goal is to write code that is pure, immutable, and composable.

## Core Principles

### Purity and Effects
- All functions that perform side effects (e.g., logging, network requests, file I/O) MUST return an `Effect`.
- An `Effect` is a data structure that describes a computation, including its potential success value, error type, and required context.
- Pure functions (no side effects) SHOULD return raw values unless they are part of a larger `Effect` pipeline.
- You MUST explicitly mark pure functions with a `@pure` tag in their JSDoc block.

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

### Handling Optional Values
- You MUST use the `Option` type from `effect` to represent values that may or may not exist.
- AVOID using `null` or `undefined` directly in your application logic. `Option` provides a safe, composable API for handling optionality.

### Error Handling
- You MUST use the `Either` type for synchronous functions that can fail, or `Effect` for asynchronous/effectful functions that can fail.
- `Either<E, A>` represents a value that is either a `Left<E>` (error) or a `Right<A>` (success).
- AVOID throwing exceptions. `Either` and `Effect` make error paths explicit and type-safe.

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

### `Effect` for Side Effects
Wrap impure operations in an `Effect` to make them declarative and composable.

```typescript
import { Effect } from 'effect';

// Impure function
const log = (message: string): void => {
  console.log(message);
};

// Wrapped in an Effect
const logEffect = (message: string): Effect.Effect<void> =>
  Effect.sync(() => log(message));

// Usage in a pipeline
const program = pipe(
  logEffect('Starting...'),
  Effect.flatMap(() => Effect.succeed(42)),
  Effect.flatMap((n) => logEffect(`The answer is ${n}.`))
);
```

### `Option` for Optional Values
Use `Option` to safely handle potentially missing values.

```typescript
import { Option } from 'effect';

const findUser = (id: number): Option.Option<{ id: number; name: string }> => {
  if (id === 1) {
    return Option.some({ id: 1, name: 'Alice' });
  }
  return Option.none();
};

const userName = pipe(
  findUser(1),
  Option.map((user) => user.name),
  Option.getOrElse(() => 'User not found')
);
// => 'Alice'
```

### `Either` for Error Handling
Use `Either` for synchronous functions that can fail.

```typescript
import { Either } from 'effect';

const parseNumber = (s: string): Either.Either<Error, number> => {
  const n = parseFloat(s);
  return isNaN(n) ? Either.left(new Error('Invalid number')) : Either.right(n);
};

const result = pipe(
  parseNumber('123'),
  Either.map((n) => n * 2),
  Either.getOrElse((e) => e.message)
);
// => 246
```

### `Schema` for Data Validation
Use `Schema` to parse and validate data structures.

```typescript
import { Schema } from '@effect/schema';

const User = Schema.struct({
  id: Schema.number,
  name: Schema.string,
});

const result = Schema.decode(User)({ id: 1, name: 'Bob' });
// => Effect.succeed({ id: 1, name: 'Bob' })

const errorResult = Schema.decode(User)({ id: '1', name: 'Bob' });
// => Effect.fail(...)
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

### JSDoc Template for Effectful Functions
You MUST use this JSDoc template for functions returning an `Effect`.

```typescript
/**
 * A brief, imperative description of what the effectful function does.
 *
 * @description A more detailed explanation if necessary.
 *
 * @param name - Description of the parameter.
 * @returns {Effect.Effect<A, E, R>} Description of the returned Effect, including:
 *   - `A`: The success type.
 *   - `E`: The error type.
 *   - `R`: The required context/services.
 *
 * @example
 * // A clear, simple example of how to use the function.
 * const program = functionName(input);
 * const result = Effect.runSync(program);
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
const addItem = <T>(arr: T[], item: T): T[] => [...arr, item];
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
import { map } from 'effect/Array';
const labels = pipe(values, map(getLabel));
```

### ❌ `null` or `undefined`
```typescript
// BAD: Returning null for missing values.
const findUser = (id: number): User | null => {
  // ...
};

// GOOD: Returning an Option.
import { Option } from 'effect';
const findUser = (id: number): Option.Option<User> => {
  // ...
};
```

### ❌ Throwing Exceptions
```typescript
// BAD: Throwing an error.
const parse = (json: string): MyType => {
  if (!isValid(json)) {
    throw new Error('Invalid JSON');
  }
  return JSON.parse(json);
};

// GOOD: Returning an Either or Effect.
import { Either } from 'effect';
const parse = (json: string): Either.Either<Error, MyType> => {
  // ...
};
```

## Code Review & Generation Checklist

When generating or reviewing code, you MUST ensure the following:
- [ ] All functions are pure and marked with `@pure`, or they return an `Effect`.
- [ ] All exported functions are `const` arrow functions.
- [ ] Immutability is strictly maintained.
- [ ] `pipe()` is used for multi-step transformations.
- [ ] `Match` is used for conditional logic.
- [ ] `Option` is used for optional values instead of `null` or `undefined`.
- [ ] `Either` or `Effect` is used for error handling instead of throwing exceptions.
- [ ] JSDoc is complete and follows the appropriate template.
- [ ] Curried functions use a data-last parameter order.
- [ ] All documented anti-patterns are avoided.
