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

## Alternative Approaches

### Approach 1: fp-ts (Type-Safe FP Library)

**Description:**
fp-ts is a comprehensive functional programming library for TypeScript that brings Haskell/Scala-like patterns. It provides:
- pipe and flow for function composition
- Option and Either for error handling
- Task for async operations
- Strong type inference and type safety
- Extensive ecosystem of FP utilities

**Advantages:**
- Superior type safety with full TypeScript integration
- Comprehensive FP ecosystem (monads, functors, etc.)
- Active community and well-maintained
- Excellent for complex domain logic
- Built specifically for TypeScript

**Limitations:**
- Steeper learning curve for developers new to FP
- More verbose syntax
- Larger bundle size
- May be overkill for simple transformations
- Documentation can be academic/theoretical

**Project Alignment:**
- ✅ Pure functions (already emphasized in codebase)
- ✅ Type safety (TypeScript 5.x / ES2022 standards)
- ✅ Immutability (favored in instructions)
- ⚠️ Adds significant dependency (not currently used)

**Example:**
```typescript
import { pipe } from 'fp-ts/function';
import { map } from 'fp-ts/Array';
import { getOrElse } from 'fp-ts/Option';

const getAllFunctionLabelValues = (): string[] => 
  pipe(
    getAllFunctionValues(),
    map(getFunctionLabelValue),
    map(label => label.toUpperCase())
  );
```

### Approach 2: Ramda (Practical FP Library)

**Description:**
Ramda is a practical functional JavaScript library that emphasizes:
- Data-last, functions-first philosophy
- Automatic currying of all functions
- pipe and compose utilities
- Extensive utility functions for data manipulation
- JavaScript-friendly FP patterns

**Advantages:**
- More JavaScript-friendly and practical
- Excellent for data transformations
- Automatic currying makes composition natural
- Well-documented with many examples
- Large ecosystem and community
- Smaller learning curve than fp-ts

**Limitations:**
- TypeScript support via @types (not native)
- Some type inference limitations
- Less strict type checking than fp-ts
- Bundle size considerations
- Not designed specifically for TypeScript

**Project Alignment:**
- ✅ Pure functions and immutability
- ✅ Practical FP patterns (currying already used)
- ✅ Data transformations (main use case)
- ⚠️ TypeScript types via DefinitelyTyped

**Example:**
```typescript
import { pipe, map, filter, compose } from 'ramda';

const getAllFunctionLabelValues = pipe(
  getAllFunctionValues,
  map(getFunctionLabelValue),
  filter(label => label !== 'function')
);
```

### Approach 3: Custom Pipe/Compose Utilities

**Description:**
Implement custom pipe and compose functions tailored to the project's needs:
- Lightweight pipe/compose implementations
- No external dependencies
- Full control over behavior and types
- Can be extended as needed
- Project-specific optimizations

**Advantages:**
- Zero dependencies (aligns with minimal approach)
- Full control over implementation
- Simpler type signatures for team
- Can evolve with project needs
- Minimal bundle impact
- Easy to understand and maintain

**Limitations:**
- Limited functionality (only basic composition)
- Need to implement additional FP utilities yourself
- Less battle-tested than established libraries
- May reinvent the wheel for common patterns
- Team needs to maintain and extend

**Project Alignment:**
- ✅ No external dependencies (keeps bundle lean)
- ✅ Project-specific needs (utilities library focus)
- ✅ Team control over evolution
- ✅ TypeScript-first design

**Example:**
```typescript
// In libs/utilities/src/lib/fp/pipe.ts
export function pipe<T, Fns extends [(arg: any) => any, ...( (arg: any) => any )[] ]>(
  value: T,
  ...fns: Fns
): PipeResult<T, Fns> {
  return fns.reduce((acc, fn) => fn(acc), value) as PipeResult<T, Fns>;
}

type PipeResult<T, Fns extends Array<(arg: any) => any>> =
  Fns extends [infer F, ...infer Rest]
    ? F extends (arg: infer A) => infer R
      ? Rest extends Array<(arg: any) => any>
        ? PipeResult<R, Rest>
        : R
      : never
    : T;

export function compose<Fns extends Array<(arg: any) => any>>(
  ...fns: Fns
): (arg: FirstArg<Fns>) => ComposeResult<Fns> {
  return (value: FirstArg<Fns>) =>
    fns.reduceRight((acc, fn) => fn(acc), value) as ComposeResult<Fns>;
}

type FirstArg<Fns extends Array<(arg: any) => any>> =
  Fns extends [infer F, ...any[]]
    ? F extends (arg: infer A) => any
      ? A
      : never
    : never;

type ComposeResult<Fns extends Array<(arg: any) => any>> =
  Fns extends [...infer Rest, infer L]
    ? L extends (arg: any) => infer R
      ? Rest extends Array<(arg: any) => any>
        ? ComposeResult<Rest>
        : R
      : never
    : never;
// Usage
const getAllFunctionLabelValues = (): string[] => 
  pipe(
    getAllFunctionValues(),
    (vals) => vals.map(getFunctionLabelValue)
  );
```

### Approach 4: Effect-TS (Modern FP with Effects)

**Description:**
Effect-TS is a modern FP library focusing on:
- Effect system for managing side effects
- pipe and flow utilities
- Modern TypeScript features
- Performance-focused
- Growing ecosystem

**Advantages:**
- Modern approach to FP in TypeScript
- Excellent effect management
- Strong type inference
- Good performance
- Growing community

**Limitations:**
- Newer library (less mature than fp-ts/Ramda)
- Smaller ecosystem
- Learning curve for effect system
- May be overkill for pure utilities
- Still evolving

**Project Alignment:**
- ✅ Modern TypeScript patterns
- ⚠️ Effect system may be unnecessary for utilities
- ⚠️ Younger ecosystem

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

## Which approach aligns better with your objectives?

Based on the analysis, I recommend **Approach 2 (Ramda)** or **Approach 3 (Custom Utilities)** for the following reasons:

**Ramda** is ideal if you want:
- Comprehensive FP utilities immediately available
- Auto-currying for all functions
- Extensive community examples
- Practical, JavaScript-friendly FP

**Custom Utilities** is ideal if you want:
- No external dependencies
- Minimal bundle size
- Full control and customization
- Simple, project-specific FP patterns

**Would you prefer:**
1. Ramda for comprehensive FP toolkit with auto-currying?
2. Custom utilities for lightweight, project-specific solution?
3. fp-ts for maximum type safety (if complex domain logic is priority)?

**Should I focus the research on your selected approach and remove the others from this document?**
