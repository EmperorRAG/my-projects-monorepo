# Contributing to My Projects Monorepo

We welcome contributions to this project! Please follow these guidelines to ensure a smooth and effective contribution process.

## How to Contribute

1. **Fork the repository** and create your branch from `main`.
2. **Set up your development environment** by following the instructions in the `README.md` file.
3. **Make your changes** in a separate branch.
4. **Write clear, commented code** following the TSDoc standards outlined below.
5. **Add or update tests** for your changes.
6. **Ensure all tests pass** by running `npx nx test <your-project>`.
7. **Submit a pull request** to the `main` branch.

## Pull Request Process

1. Ensure your PR is small and focused on a single issue or feature.
2. Provide a clear and descriptive title for your PR.
3. In the PR description, explain the "what" and "why" of your changes.
4. Link to any relevant issues.
5. Request a review from one of the project maintainers.

## TSDoc Standards

All TypeScript code should be documented using TSDoc. This helps maintain code quality and makes it easier for others (and AI agents) to understand the codebase.

- All public functions, classes, and interfaces must have a TSDoc block.
- Use `@param` to document function parameters.
- Use `@returns` to describe the return value of a function.
- Provide a clear and concise summary of the symbol's purpose.

### Example

```typescript
/**
 * Calculates the sum of two numbers.
 *
 * @param a - The first number.
 * @param b - The second number.
 * @returns The sum of the two numbers.
 */
export function add(a: number, b: number): number {
  return a + b;
}
```
