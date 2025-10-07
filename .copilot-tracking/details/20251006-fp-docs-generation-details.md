<!-- markdownlint-disable-file -->
# Task Details: Update Utilities Docs for FP Paradigm

## Research Reference

**Source Research**: #file:../research/20250126-ai-documentation-fp-patterns.md
**FP Standards**: #file:../../.github/instructions/fp-paradigm.instructions.md

## Phase 1: Document `function.utils.ts`

### Task 1.1: Update JSDoc for `getAllFunctionLabelValues`

Update the JSDoc for the `getAllFunctionLabelValues` function to include the standard FP documentation template. This function will be refactored to use `pipe`.

- **Files**:
  - `libs/utilities/src/lib/helper-functions/function.utils.ts` - Modify the JSDoc for `getAllFunctionLabelValues`.
- **Success**:
  - The JSDoc includes `@pure`.
  - The JSDoc includes a `@composition` tag explaining the `pipe` operation.
  - The JSDoc follows the template from the FP paradigm instructions.
- **Research References**:
  - #file:../../.github/instructions/fp-paradigm.instructions.md (Lines 100-121) - JSDoc template reference.
  - #file:../../.github/instructions/fp-paradigm.instructions.md (Lines 60-71) - `pipe` composition example.

### Task 1.2: Update JSDoc for `getFunctionLabelValue`

Update the JSDoc for the `getFunctionLabelValue` function. This is a simple helper function used within the composition.

- **Files**:
  - `libs/utilities/src/lib/helper-functions/function.utils.ts` - Modify the JSDoc for `getFunctionLabelValue`.
- **Success**:
  - The JSDoc includes the `@pure` tag.
  - The description accurately reflects the function's purpose.
- **Research References**:
  - #file:../../.github/instructions/fp-paradigm.instructions.md (Lines 100-121) - JSDoc template reference.

## Phase 2: Document `primitive.utils.ts`

### Task 2.1: Update JSDoc for `getPrimitiveLabelValue`

Update the JSDoc for the `getPrimitiveLabelValue` function. This function will be refactored to use `Match` for pattern matching.

- **Files**:
  - `libs/utilities/src/lib/helper-functions/primitive.utils.ts` - Modify the JSDoc for `getPrimitiveLabelValue`.
- **Success**:
  - The JSDoc includes the `@pure` tag.
  - The JSDoc includes a description of the pattern matching logic.
  - The JSDoc follows the template from the FP paradigm instructions.
- **Research References**:
  - #file:../../.github/instructions/fp-paradigm.instructions.md (Lines 100-121) - JSDoc template reference.
  - #file:../../.github/instructions/fp-paradigm.instructions.md (Lines 73-96) - `Match` pattern matching example.

## Dependencies

- Completion of the `effect` library installation.

## Success Criteria

- All JSDoc in the specified files is updated and adheres to the project's FP standards.
