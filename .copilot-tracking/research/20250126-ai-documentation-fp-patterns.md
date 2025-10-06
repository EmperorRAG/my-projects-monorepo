<!-- markdownlint-disable-file -->
# AI Documentation for FP Paradigm Adherence

## Research Executed

### Documentation Analysis
- Examined existing JSDoc patterns in utilities library
- Analyzed .github/instructions/ for documentation standards
- Researched AI-readable annotation patterns
- Investigated industry-standard FP documentation approaches

### External Research
- #githubRepo:"reduxjs/redux-toolkit TypeScript FP patterns"
  - Found extensive use of type-safe function composition
  - Pattern: Marking pure functions with @pure JSDoc tag
  - Architecture Decision Records (ADRs) for design choices
  - Inline code comments explaining FP transformations

- #githubRepo:"Effect-TS/effect documentation patterns"
  - Comprehensive API documentation with FP terminology
  - Type signatures prominently displayed
  - Clear examples showing pipe/compose usage
  - Markdown documentation with code examples

- #fetch:https://github.com/gcanti/fp-ts/tree/master/docs
  - Structured documentation by concept
  - "Getting Started" guides for FP patterns
  - Module-level documentation
  - Extensive inline examples

### Project Conventions
- Current: JSDoc with @param, @returns, "Example usage:"
- Existing: "This function is pure" in comments
- Pattern: Descriptive function names indicating behavior
- No formal FP paradigm documentation yet

## Key Discoveries

### Essential AI-Readable Documentation Patterns

**1. Explicit Purity Markers**
AI models benefit from explicit function purity annotations:
```typescript
/**
 * @pure No side effects, referentially transparent
 * @category Utility
 */
export const getAllFunctionLabelValues = (): string[] => 
  pipe(getAllFunctionValues(), map(getFunctionLabelValue));
```

**2. Composition Documentation**
Document the composition strategy so AI understands data flow:
```typescript
/**
 * Maps primitive values to labels using composition.
 * 
 * @composition 
 * getAllPrimitiveValues() 
 *   |> map(getPrimitiveLabelValue)
 *   |> return string[]
 * 
 * @pure
 */
```

**3. FP Pattern Tags**
Use standardized tags for FP patterns:
```typescript
/**
 * @fp-pattern Higher-order function
 * @fp-pattern Curried function (data-last)
 * @fp-pattern Point-free style
 * @returns Partially applied function
 */
export const toObjects = <K extends string, T>(propertyName: K) =>
  (values: T[]): Record<K, T>[] => // ...
```

**4. Type-Level Documentation**
Include type transformations in documentation:
```typescript
/**
 * Type transformation: T[] -> Record<K, T>[]
 * 
 * @fp-signature (K, T[]) -> Record<K, T>[]
 * @curried (K) -> (T[]) -> Record<K, T>[]
 */
```

## Recommended Documentation Structure

### 1. FP Paradigm Instructions File

**File:** `.github/instructions/fp-paradigm.instructions.md`

```markdown
---
description: 'Functional Programming paradigm guidelines for TypeScript'
applyTo: '**/*.ts'
---

# Functional Programming Paradigm

## Core Principles

### Purity
- All exported functions MUST be pure (no side effects)
- Mark impure functions explicitly with @impure
- Document any necessary side effects
- Prefer pure alternatives when possible

### Immutability
- Never mutate input parameters
- Use const for all bindings
- Prefer readonly types
- Return new objects/arrays instead of modifying

### Function Composition
- Use pipe() for left-to-right data flow
- Use compose() for right-to-left composition
- Document composition chains in JSDoc
- Prefer point-free style where readable

### Currying & Partial Application
- Implement data-last parameter order
- Use currying for reusable transformations
- Document curried signatures
- Provide uncurried alternatives for simple cases

## Required Function Patterns

### Arrow Functions with const Export
```typescript
// ✅ CORRECT: Arrow function with const
export const functionName = (param: Type): ReturnType => {
  // implementation
};

// ❌ AVOID: Function declarations
export function functionName(param: Type): ReturnType {
  // implementation
}
```

### Pipe Composition
```typescript
// ✅ CORRECT: Pipe for clarity
export const transform = (data: Data): Result =>
  pipe(
    data,
    validate,
    normalize,
    process
  );

// ⚠️ ACCEPTABLE: Method chaining for simple cases
export const transform = (data: Data): Result =>
  data.map(validate).filter(normalize);
```

### Curried Functions
```typescript
// ✅ CORRECT: Curried with data-last
export const createFormatter = (config: Config) =>
  (data: Data): string => format(config, data);

// ✅ CORRECT: Using partial application
export const toLabelObjects = toObjects('label');
```

## Documentation Standards

### JSDoc Template for Pure Functions
```typescript
/**
 * Brief description of what the function does.
 * 
 * @pure Indicates this function has no side effects
 * @category Group/module this belongs to
 * 
 * @param paramName - Parameter description
 * @returns Return value description
 * 
 * @example
 * // Show practical usage
 * const result = functionName(input);
 * // => expected output
 * 
 * @fp-pattern Composition | Curried | Point-free
 */
```

### Composition Documentation
```typescript
/**
 * @composition
 * input 
 *   |> step1  // Description of step1
 *   |> step2  // Description of step2
 *   |> output
 */
```

### Type Signatures
```typescript
/**
 * @fp-signature (A) -> B
 * @curried-signature (Config) -> (A) -> B
 */
```

## Anti-Patterns to Avoid

### ❌ Mutation
```typescript
// BAD: Mutates input
const addItem = (arr: T[], item: T) => {
  arr.push(item);
  return arr;
};

// GOOD: Returns new array
const addItem = (arr: T[], item: T): T[] => [...arr, item];
```

### ❌ If-Else Pyramids
```typescript
// BAD: Nested conditions
const getLabel = (value: unknown): string => {
  if (isNull(value)) {
    return 'null';
  } else if (isBigInt(value)) {
    return 'bigint';
  } else {
    // ...
  }
};

// GOOD: Pattern matching or guard clauses
const getLabel = (value: unknown): string => {
  if (isNull(value)) return 'null';
  if (isBigInt(value)) return 'bigint';
  if (isSymbol(value)) return 'symbol';
  return getTypeOf(value);
};
```

### ❌ Imperative Loops
```typescript
// BAD: Imperative for loop
const labels = [];
for (let i = 0; i < values.length; i++) {
  labels.push(getLabel(values[i]));
}

// GOOD: Declarative map
const labels = values.map(getLabel);
```

## Code Review Checklist

When reviewing FP code, ensure:

- [ ] All functions are pure (no side effects)
- [ ] Arrow functions used with const export
- [ ] Immutability maintained (no mutations)
- [ ] Composition used for multi-step transformations
- [ ] JSDoc includes @pure tag
- [ ] Currying uses data-last parameter order
- [ ] Examples provided in documentation
- [ ] Type signatures documented
- [ ] Anti-patterns avoided

## AI Model Instructions

When generating or reviewing code:

1. **Identify Function Type**: Check @pure, @impure tags
2. **Analyze Composition**: Look for pipe/compose patterns
3. **Verify Immutability**: Ensure no mutations
4. **Check Currying**: Validate data-last order
5. **Review Documentation**: Ensure FP patterns documented

This file helps AI models understand that the codebase fully adheres to FP paradigm.
```

### 2. Enhanced JSDoc Standards

**Standard JSDoc Enhancement:**
```typescript
/**
 * Converts an array of values into an array of objects.
 * 
 * @pure Referentially transparent, no side effects
 * @category Data Transformation
 * @fp-pattern Curried function (data-last parameter order)
 * 
 * @template K - Property name type (extends string)
 * @template T - Value type
 * 
 * @param propertyName - The property name for each object
 * @returns Curried function accepting values array
 * 
 * @example
 * // Direct usage
 * const objects = toObjects('label', ['a', 'b']);
 * // => [{ label: 'a' }, { label: 'b' }]
 * 
 * @example
 * // Curried usage
 * const toLabelObjects = toObjects('label');
 * toLabelObjects(['a', 'b']);
 * // => [{ label: 'a' }, { label: 'b' }]
 * 
 * @fp-signature (K, T[]) -> Record<K, T>[]
 * @curried-signature (K) -> (T[]) -> Record<K, T>[]
 */
export const toObjects = <K extends string, T>(propertyName: K) =>
  (values: T[]): Record<K, T>[] =>
    values.map((value) => ({ [propertyName]: value }) as Record<K, T>);
```

### 3. Architecture Decision Records (ADRs)

**File:** `docs/adr/0001-functional-programming-paradigm.md`

```markdown
# ADR 0001: Adopt Functional Programming Paradigm

## Status
Accepted

## Context
The codebase contains utility functions that would benefit from:
- Explicit function composition patterns
- Consistent FP documentation
- Type-safe transformations
- AI-readable paradigm markers

## Decision
Adopt functional programming paradigm with:
1. Pure functions by default
2. Pipe/compose for composition
3. Arrow functions with const export
4. Currying for partial application
5. Comprehensive FP documentation

## Consequences

### Positive
- More maintainable and testable code
- Better type inference
- Clearer data flow
- AI models understand paradigm adherence
- Consistent coding patterns

### Negative
- Learning curve for developers new to FP
- More documentation required
- Potential verbosity in some cases

### Mitigation
- Provide FP training and examples
- Document patterns in .github/instructions/
- Use JSDoc to explain complex compositions
- Create migration guides
```

### 4. Code Examples Repository

**File:** `docs/fp-examples/README.md`

```markdown
# Functional Programming Examples

## Before/After Conversions

### Example 1: Simple Transformation

**Before (Imperative):**
```typescript
export function getAllFunctionLabelValues(): string[] {
  const values = getAllFunctionValues();
  const labels = [];
  for (const value of values) {
    labels.push(getFunctionLabelValue(value));
  }
  return labels;
}
```

**After (Functional with Pipe):**
```typescript
/**
 * @pure
 * @composition getAllFunctionValues |> map(getFunctionLabelValue)
 */
export const getAllFunctionLabelValues = (): string[] =>
  pipe(
    getAllFunctionValues(),
    map(getFunctionLabelValue)
  );
```

### Example 2: Conditional Logic

**Before (If-Else Chain):**
```typescript
export const getPrimitiveLabelValue = (value: unknown): string => {
  if (isNull(value)) {
    return 'null';
  } else if (isBigInt(value)) {
    return 'bigint';
  } else if (isSymbol(value)) {
    return 'symbol';
  }
  return getTypeOf(value);
};
```

**After (Functional Guards):**
```typescript
/**
 * @pure
 * @fp-pattern Guard clauses (early return)
 */
export const getPrimitiveLabelValue = (value: unknown): string => {
  if (isNull(value)) return 'null';
  if (isBigInt(value)) return 'bigint';
  if (isSymbol(value)) return 'symbol';
  if (isString(value)) return 'string';
  if (isNumber(value)) return 'number';
  if (isBoolean(value)) return 'boolean';
  if (isUndefined(value)) return 'undefined';
  return getTypeOf(value);
};
```

### Example 3: Currying Pattern

**Before (Standard Function):**
```typescript
export const toObjects = <K extends string, T>(
  propertyName: K, 
  values: T[]
): Record<K, T>[] => {
  return values.map(value => ({ [propertyName]: value }));
};
```

**After (Curried):**
```typescript
/**
 * @pure
 * @fp-pattern Curried function (data-last)
 * @curried-signature (K) -> (T[]) -> Record<K, T>[]
 */
export const toObjects = <K extends string, T>(propertyName: K) =>
  (values: T[]): Record<K, T>[] =>
    values.map((value) => ({ [propertyName]: value }) as Record<K, T>);

// Specialized versions via partial application
export const toLabelObjects = toObjects('label');
export const toInputObjects = toObjects('input');
```
```

### 5. Type-Level Documentation

**File:** `libs/utilities/src/lib/fp/types.ts`

```typescript
/**
 * Utility types for functional programming patterns.
 * These types help document and enforce FP conventions.
 * 
 * @module fp/types
 * @category Type Utilities
 */

/**
 * Represents a pure function (no side effects).
 * @pure This type represents referentially transparent functions
 */
export type PureFunction<A, B> = (input: A) => B;

/**
 * Represents a curried function.
 * @fp-pattern Curried function type
 */
export type Curried<A, B, C> = (a: A) => (b: B) => C;

/**
 * Pipe function signature (left-to-right composition).
 * @fp-pattern Function composition (left to right)
 */
export type Pipe = {
  <A>(a: A): A;
  <A, B>(a: A, ab: (a: A) => B): B;
  <A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C;
  <A, B, C, D>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D;
};

/**
 * Compose function signature (right-to-left composition).
 * @fp-pattern Function composition (right to left)
 */
export type Compose = {
  <A>(a: A): A;
  <A, B>(ab: (a: A) => B): (a: A) => B;
  <A, B, C>(bc: (b: B) => C, ab: (a: A) => B): (a: A) => C;
  <A, B, C, D>(cd: (c: C) => D, bc: (b: B) => C, ab: (a: A) => B): (a: A) => D;
};
```

## Implementation Guidance

### Phase 1: Documentation Infrastructure
- Create `.github/instructions/fp-paradigm.instructions.md`
- Set up ADR template and first ADR
- Create examples repository structure

### Phase 2: Code Documentation
- Add @pure tags to all pure functions
- Document composition patterns with @composition
- Add @fp-pattern tags for FP patterns
- Include type signatures in JSDoc

### Phase 3: Enhanced Examples
- Create before/after examples for common patterns
- Document anti-patterns to avoid
- Provide migration guides for team

### Phase 4: AI Integration
- Test AI model understanding with new docs
- Refine documentation based on AI comprehension
- Create AI-specific prompts for FP code generation

### Success Criteria
- [ ] All pure functions marked with @pure
- [ ] FP paradigm instructions created
- [ ] ADRs document FP decisions
- [ ] Examples repository established
- [ ] Type-level documentation complete
- [ ] AI models correctly identify FP patterns
- [ ] Team trained on FP documentation standards

## Key Takeaways for AI Models

1. **@pure tag** = Function has no side effects, is referentially transparent
2. **@composition** = Documents data flow through functions
3. **@fp-pattern** = Identifies specific FP pattern used
4. **@curried-signature** = Shows curried function signature
5. **Arrow + const export** = Preferred function declaration style
6. **pipe()** = Left-to-right composition
7. **compose()** = Right-to-left composition
8. **data-last** = Parameter order for currying
9. **Point-free** = Functions without explicit parameter references
10. **Immutability** = Never mutate, always return new values

This comprehensive documentation strategy ensures AI models can:
- Identify FP paradigm adherence
- Generate FP-compliant code
- Understand composition patterns
- Follow currying conventions
- Recognize pure vs impure functions
- Maintain consistency with existing patterns
