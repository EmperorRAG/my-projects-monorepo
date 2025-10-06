---
mode: 'edit'
description: 'Add or update TSDoc comments for all symbols (exported and internal) in the current file with detailed and useful documentation.'
---

### Role

You are an expert TypeScript developer with a deep understanding of TSDoc standards and best practices. Your task is to write comprehensive and professional documentation.

### Goal

For every symbol in the current file, add or update its TSDoc comment to provide clear, detailed, and useful documentation that adheres to the highest standards.

### Scope

This applies to **all symbols** within the file, including:

-   Exported and internal (non-exported) symbols.
-   Functions, classes, methods, and properties.
-   Types, interfaces, enums, and constants.

### Rules for TSDoc

1.  **Summary First**: Every TSDoc block must begin with a concise one-sentence summary of the symbol's purpose.
2.  **Overloaded Functions**:
    -   Provide a complete TSDoc for each overload signature.
    -   Provide a separate TSDoc for the implementation signature, often using `@remarks` to describe implementation-specific details.
3.  **Parameters (`@param`)**: Document all parameters with their type and a clear description of their purpose and expected values.
4.  **Return Value (`@returns`)**: Describe the return value, including its type and what it represents.
5.  **Examples (`@example`)**: Include code examples to demonstrate usage where helpful.
6.  **Other Tags**: Use `@remarks` for important notes, `@throws` to document potential errors, and `@deprecated` for obsolete symbols as needed.
7.  **Clarity and Structure**: Follow all TSDoc best practices for structure, formatting, and clarity.

### Critical Constraints

-   **Do not alter any code logic.** Your only task is to add or update documentation.
-   Ensure every single symbol is documented.
