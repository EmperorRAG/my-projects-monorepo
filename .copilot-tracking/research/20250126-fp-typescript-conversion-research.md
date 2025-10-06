<!-- markdownlint-disable-file -->
# Task Research Notes: FP TypeScript Conversion & AI Documentation

## Research Executed

### File Analysis
- `/home/runner/work/my-projects-monorepo/my-projects-monorepo/libs/utilities/src/lib/helper-functions/function.utils.ts`
  - Current code uses arrow functions with export const pattern
  - Functions are already pure and stateless
  - Composition mentioned in JSDoc comments but not implemented with pipe/compose
  - Example: `getAllFunctionLabelValues = (): string[] => getAllFunctionValues().map(getFunctionLabelValue)`

- `/home/runner/work/my-projects-monorepo/my-projects-monorepo/libs/utilities/src/lib/helper-functions/toObjects.utils.ts`
  - Curried functions already implemented
  - Pattern: `toInputObjects = <T>(values: T[]): { input: T }[] => toObjects<'input', T>('input', values)`
  - Base function `toObjects` used for partial application

- `/home/runner/work/my-projects-monorepo/my-projects-monorepo/libs/utilities/src/lib/helper-functions/primitive.utils.ts`
  - Multiple if-else chains that could benefit from pipe/compose
  - Pattern of mapping arrays with functions already present
  - Example: `getAllPrimitiveValues().map(getPrimitiveLabelValue)`

- `/home/runner/work/my-projects-monorepo/my-projects-monorepo/.github/instructions/typescript-5-es2022.instructions.md`
  - Existing conventions: "Favor immutable data and pure functions when practical"
  - "Keep functions focused; extract helpers when logic branches grow"
  - "Use pure ES modules; never emit require, module.exports, or CommonJS helpers"
  - No specific FP library guidelines present

### Code Search Results
- `pipe|compose` searches
  - Found only in comments: "composes getAllFunctionValues and getFunctionLabelValue"
  - No actual pipe/compose implementations found
  - Total TypeScript files: 35 files

- Current patterns
  - Arrow functions: Already using `export const functionName = () => {}`
  - Pure functions: Most utility functions are already pure
  - Function composition: Using method chaining (.map, .filter) but not explicit compose/pipe

### External Research
- #fetch:https://gcanti.github.io/fp-ts/
  - fp-ts is a comprehensive FP library for TypeScript
  - Provides: pipe, flow (left-to-right composition), Option, Either, Task, and more
  - Type-safe and follows Haskell/Scala FP patterns
  - Pipe signature: `pipe(a, f, g, h)` - applies functions left-to-right

- #fetch:https://ramdajs.com/docs/
  - Ramda is a practical functional library for JavaScript
  - All functions are automatically curried
  - Data-last philosophy (perfect for composition)
  - Provides: pipe, compose, curry, partial application utilities
  - TypeScript support via @types/ramda

- #githubRepo:"gcanti/fp-ts examples pipe compose"
  - Found extensive examples of pipe usage
  - Pattern: `pipe(data, fn1, fn2, fn3)` replaces nested function calls
  - Flow for function composition: `const transform = flow(fn1, fn2, fn3)`
  - Commonly used with Option and Either for error handling

- #githubRepo:"ramda/ramda typescript examples"
  - Ramda compose: `compose(f, g, h)(x)` evaluates right-to-left: f(g(h(x)))
  - Ramda pipe: `pipe(f, g, h)(x)` evaluates left-to-right: h(g(f(x)))
  - TypeScript definitions available via DefinitelyTyped

### Project Conventions
- Standards referenced: TypeScript 5.x / ES2022, Pure ES modules, Pure functions preferred
- Instructions followed: .github/instructions/typescript-5-es2022.instructions.md
- Existing patterns: Arrow functions, currying, partial application already used
- No FP library dependencies currently installed

## Key Discoveries

### Project Structure
The codebase already follows many FP principles:
- Pure functions (documented in comments)
- Arrow functions as primary pattern
- Partial application via currying (toInputObjects, toLabelObjects, etc.)
- Stateless transformations (map, filter operations)
- No side effects in utility functions

Current gaps:
- No explicit pipe/compose utilities
- No FP library installed (no fp-ts, Ramda, lodash/fp)
- Method chaining instead of composition functions
- If-else chains that could use functional patterns

### Implementation Patterns

**Current Code Example:**
```typescript
// Current pattern - method chaining
export const getAllFunctionLabelValues = (): string[] =>
  getAllFunctionValues().map(getFunctionLabelValue);

// Current pattern - if-else chains
export const getPrimitiveLabelValue = (value: unknown): string => {
  if (isNull(value)) return 'null';
  if (isBigInt(value)) return 'bigint';
  if (isSymbol(value)) return 'symbol';
  // ... more conditions
  return getTypeOf(value);
};
```

**FP Conversion Options:**

### Complete Examples

**Option 1: fp-ts with pipe (Recommended for type safety)**
```typescript
import { pipe } from 'fp-ts/function';
import { map } from 'fp-ts/Array';

// Converted to pipe
export const getAllFunctionLabelValues = (): string[] =>
  pipe(
    getAllFunctionValues(),
    map(getFunctionLabelValue)
  );

// Pattern matching with fp-ts
import { match } from 'fp-ts/boolean';

export const getPrimitiveLabelValue = (value: unknown): string =>
  pipe(
    value,
    match(
      () => isNull(value) ? 'null' :
            isBigInt(value) ? 'bigint' :
            isSymbol(value) ? 'symbol' :
            // ... pattern continues
            getTypeOf(value)
    )
  );
```

**Option 2: Ramda with pipe (More JavaScript-native)**
```typescript
import { pipe, map, cond, always, T } from 'ramda';

// Converted to Ramda pipe
export const getAllFunctionLabelValues = (): string[] =>
  pipe(
    getAllFunctionValues,
    map(getFunctionLabelValue)
  )();

// Conditional logic with cond
export const getPrimitiveLabelValue = (value: unknown): string =>
  cond([
    [isNull, always('null')],
    [isBigInt, always('bigint')],
    [isSymbol, always('symbol')],
    [isString, always('string')],
    [isNumber, always('number')],
    [isBoolean, always('boolean')],
    [isUndefined, always('undefined')],
    [T, getTypeOf]
  ])(value);
```

**Option 3: Custom pipe/compose utilities (No external dependencies)**
```typescript
// Custom pipe utility supporting heterogeneous function chains
export function pipe<A, B>(fn1: (a: A) => B): (a: A) => B;
export function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C;
export function pipe<A, B, C, D>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D): (a: A) => D;
export function pipe<A, B, C, D, E>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D, fn4: (d: D) => E): (a: A) => E;
export function pipe(...fns: Array<(arg: any) => any>) {
  return (input: any) => fns.reduce((acc, fn) => fn(acc), input);
}

// Custom compose utility (right-to-left) supporting heterogeneous function chains
export function compose<A, B>(fn1: (a: A) => B): (a: A) => B;
export function compose<A, B, C>(fn1: (b: B) => C, fn2: (a: A) => B): (a: A) => C;
export function compose<A, B, C, D>(fn1: (c: C) => D, fn2: (b: B) => C, fn3: (a: A) => B): (a: A) => D;
export function compose<A, B, C, D, E>(fn1: (d: D) => E, fn2: (c: C) => D, fn3: (b: B) => C, fn4: (a: A) => B): (a: A) => E;
export function compose(...fns: Array<(arg: any) => any>) {
  return (input: any) => fns.reduceRight((acc, fn) => fn(acc), input);
}

// Usage
export const getAllFunctionLabelValues = (): string[] =>
  pipe(
    getAllFunctionValues(),
    (vals) => vals.map(getFunctionLabelValue)
  );
```

### API and Schema Documentation

**fp-ts Type Signatures:**
```typescript
// pipe: applies functions left-to-right
function pipe<A>(a: A): A
function pipe<A, B>(a: A, ab: (a: A) => B): B
function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C
// ... up to 20 functions

// flow: creates a composition (doesn't execute immediately)
function flow<A extends ReadonlyArray<unknown>, B>(
  ab: (...a: A) => B
): (...a: A) => B
function flow<A extends ReadonlyArray<unknown>, B, C>(
  ab: (...a: A) => B,
  bc: (b: B) => C
): (...a: A) => C
```

**Ramda Type Signatures:**
```typescript
// pipe: left-to-right composition
pipe<T1, R>(fn0: (x0: T1) => R): (x0: T1) => R;
pipe<T1, T2, R>(fn0: (x0: T1) => T2, fn1: (x: T2) => R): (x0: T1) => R;

// compose: right-to-left composition
compose<T1, R>(fn0: (x0: T1) => R): (x0: T1) => R;
compose<T1, T2, R>(fn1: (x: T2) => R, fn0: (x0: T1) => T2): (x0: T1) => R;
```

### Configuration Examples

**Package.json additions for fp-ts:**
```json
{
  "dependencies": {
    "fp-ts": "^2.16.1"
  }
}
```

**Package.json additions for Ramda:**
```json
{
  "dependencies": {
    "ramda": "^0.29.1"
  },
  "devDependencies": {
    "@types/ramda": "^0.29.9"
  }
}
```

**Custom utilities (no package changes):**
```json
// No package.json changes needed
// Add utilities in libs/utilities/src/lib/fp/
```

### Technical Requirements

**For fp-ts approach:**
- Install fp-ts package
- Learn fp-ts type system (Option, Either, etc.)
- More verbose but type-safe
- Best for complex domain logic

**For Ramda approach:**
- Install ramda + @types/ramda
- More JavaScript-friendly
- Auto-curried functions
- Best for data transformations

**For custom utilities:**
- No dependencies
- Full control over implementation
- Simpler types
- Best for basic composition needs

## Recommended Approach: Effect-TS

Based on the research and your selection, the recommended approach is to adopt **Effect-TS** for implementing functional programming patterns. This modern library aligns well with the project's existing use of TypeScript and pure functions while introducing powerful, type-safe tools for composition and error handling.

### Key Features to Adopt
- **`pipe` function**: For creating readable, left-to-right data transformation pipelines. This will replace existing method chaining (`.map()`).
- **`Match` module**: For declarative, type-safe pattern matching. This will replace `if-else` and `switch` statements.

### Implementation Patterns

**Pipe for Composition:**
The `pipe` function will be the primary way to compose functions. It takes an initial value and a series of functions, passing the output of one as the input to the next.

```typescript
import { pipe } from 'effect';
import { map } from 'effect/Array'; // Assuming Array module for map

// Current pattern
// export const getAllFunctionLabelValues = (): string[] =>
//   getAllFunctionValues().map(getFunctionLabelValue);

// Converted to Effect-TS pipe
export const getAllFunctionLabelValues = (): string[] =>
  pipe(
    getAllFunctionValues(),
    map(getFunctionLabelValue)
  );
```

**Pattern Matching with `Match`:**
The `Match` module provides a powerful and readable way to handle conditional logic, replacing complex `if-else` chains.

```typescript
import { Match } from 'effect';
import { isNull, isBigInt, isSymbol, isString, isNumber, isBoolean, isUndefined } from './primitive.utils'; // Assuming these are the predicate functions
import { getTypeOf } from './primitive.utils'; // Fallback function

// Current pattern - if-else chain
// export const getPrimitiveLabelValue = (value: unknown): string => {
//   if (isNull(value)) return 'null';
//   if (isBigInt(value)) return 'bigint';
//   // ... more conditions
//   return getTypeOf(value);
// };

// Converted to Effect-TS Match
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

### API and Schema Documentation

**Effect-TS `pipe` Signature:**
```typescript
// pipe: applies functions left-to-right
import { pipe } from "effect"
const result = pipe(input, func1, func2, ..., funcN)
```

**Effect-TS `Match` Signature:**
```typescript
import { Match } from "effect"

const match = Match.type<InputType>().pipe(
  Match.when(condition1, result1),
  Match.when(condition2, result2),
  Match.exhaustive | Match.orElse(fallback)
)
```

### Configuration Examples

**Package.json additions for Effect-TS:**
```json
{
  "dependencies": {
    "effect": "^2.0.0"
  }
}
```

### Technical Requirements
- Install the `effect` package.
- Refactor existing method chains (`.map`) to use `pipe`.
- Refactor `if-else` and `switch` statements to use the `Match` module.
- Update JSDoc comments to reflect the use of `Effect-TS` patterns.

## AI Documentation for FP Adherence

### Documentation Strategy

To help AI models understand FP paradigm adherence, create comprehensive documentation:

1. **FP Conventions File** (`.github/instructions/fp-paradigm.instructions.md`)
   - Define FP principles for the project
   - Specify pipe/compose usage patterns
   - Document currying and partial application standards
   - Provide examples of approved patterns

2. **Code-Level Documentation**
   - JSDoc comments with FP terminology
   - Mark pure functions explicitly
   - Document composition chains
   - Show data flow in comments

3. **Architecture Decision Records (ADRs)**
   - Document why FP approach chosen
   - Record library selection rationale
   - Track evolution of FP patterns

4. **Examples Repository**
   - Create example files showing FP patterns
   - Include before/after conversions
   - Document anti-patterns to avoid

### Example FP Documentation Structure

**File: `.github/instructions/fp-paradigm.instructions.md`**
```markdown
---
description: 'Functional Programming paradigm guidelines for TypeScript'
applyTo: '**/*.ts'
---

# Functional Programming Paradigm

## Core Principles
- All functions MUST be pure (no side effects)
- Use pipe/compose for function composition
- Prefer arrow functions with const export
- Implement currying for partial application
- Data immutability by default

## Function Composition
- Use pipe for left-to-right data flow
- Use compose for traditional composition
- Chain transformations explicitly
- Document composition intent

## Pattern Examples
[Include specific patterns]

## Anti-Patterns to Avoid
- Mutable state
- If-else pyramids (use pattern matching)
- Imperative loops (use map/reduce/filter)
```

**Enhanced JSDoc Format:**
```typescript
/**
 * Maps all function values to their string labels.
 *
 * @pure This function has no side effects
 * @composition Composes getAllFunctionValues with map(getFunctionLabelValue)
 * @pattern Pure function composition using pipe
 *
 * @returns {string[]} Array of string labels
 *
 * @example
 * // Using pipe for clarity
 * pipe(
 *   getAllFunctionValues(),
 *   map(getFunctionLabelValue)
 * )
 */
export const getAllFunctionLabelValues = (): string[] =>
  pipe(getAllFunctionValues(), map(getFunctionLabelValue));
```

### AI-Readable Annotations

**Function Purity Markers:**
```typescript
/** @pure */ // Explicitly mark pure functions
/** @impure */ // Mark functions with side effects (rare)
/** @composition pipe(fn1, fn2, fn3) */ // Document composition
```

**Type-Level Documentation:**
```typescript
/**
 * @fp-pattern Curried function for partial application
 * @data-last Parameters ordered for composition (data last)
 */
export const toObjects = <K extends string, T>(propertyName: K) =>
  (values: T[]): Record<K, T>[] =>
    values.map((value) => ({ [propertyName]: value }) as Record<K, T>);
```
