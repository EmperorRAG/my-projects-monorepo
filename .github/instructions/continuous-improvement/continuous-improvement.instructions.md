---
description: 'Temporary instruction cache for AI models - instructions here will be sorted into appropriate instruction files later'
applyTo: '**/*'
---

# Continuous Improvement Instructions Cache

This file serves as a temporary cache for instructions that AI models must follow during development. Instructions captured here will be reviewed and sorted into their appropriate permanent instruction files at a later point.

## Purpose

- **Temporary Storage**: Capture new patterns, learnings, and best practices as they emerge
- **Centralized Reference**: Provide a single location for AI models to check for recent guidance
- **Staged Migration**: Allow instructions to be refined before being moved to permanent locations

## Usage

When AI models encounter new patterns or requirements that should be documented:

1. Add the instruction to this file with context
2. Include the date and scenario where the instruction applies
3. Mark instructions that have been migrated to permanent files
4. Periodically review and migrate instructions to appropriate permanent instruction files

## Instructions

<!-- Add new instructions below this line -->

1. When implementing code, documentation must always be contained within the code's JSDoc comment unless it has either been conveyed implicitly or explicitly that the AI model may ignore this instruction when prompted.
2. When implementing code, you must never include examples outside of the code's JSDoc comment unless it has either been conveyed implicitly or explicitly that the AI model may ignore this instruction when prompted.
3. When implementing tests for code, you must never change the code you are making tests for.

### Testing Pattern for >90% Coverage (Added: 2025-10-16)

**Context**: When creating comprehensive test suites targeting >90% code coverage

**Pattern**:

1. **Organize tests by component/function** - Use clear `describe` blocks for each exported function or constant
2. **Test default configurations** - Verify all default values and their correctness
3. **Test all function parameters** - Cover every parameter and optional field
4. **Test edge cases** - Empty arrays, undefined values, minimal configurations, maximum configurations
5. **Test environment variables** - Verify environment variable handling and fallbacks
6. **Test type safety** - Ensure TypeScript types are enforced correctly
7. **Integration tests** - Test complex scenarios combining multiple features
8. **Use meaningful test names** - Follow pattern: "should [expected behavior] when [condition]"

**Structure**:

```typescript
describe('Module Name', () => {
  describe('constant/function name', () => {
    it('should have correct default values', () => {
      /* ... */
    });
    it('should handle edge case X', () => {
      /* ... */
    });
    it('should preserve type information', () => {
      /* ... */
    });
  });

  describe('Integration Tests', () => {
    it('should handle production-ready configuration', () => {
      /* ... */
    });
  });
});
```

**Coverage Goals**:

- All exported functions: 100%
- All default constants: 100%
- All configuration options: 100%
- All plugin types: 100%
- Edge cases and error paths: 90%+

**Example**: See `libs/better-auth-utilities/src/lib/config.spec.ts` for a comprehensive example achieving >90% coverage with 60+ test cases.

---

## Migration Log

<!-- When instructions are migrated, move them here with references to their new location -->
