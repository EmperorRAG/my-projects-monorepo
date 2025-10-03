import { test, expect } from '@jest/globals';

/**
 * Jest table-driven test runner for evaluating any function with a customizable matcher.
 *
 * @param fn - The function to test.
 * @returns Curried function accepting matcher, then description and cases.
 *
 * @example
 * const runJestTableTest = runJestTableTestWithMatcher(IsValueStringable);
 * runJestTableTest((result, expected) => jestExpect(result).toBe(expected))('Test primitives', [
 *   { input: 'foo', expected: true, label: 'string' },
 *   { input: 123, expected: true, label: 'number' },
 * ]);
 */
export const runTableTestWithMatcher =
	<Input, Expected>(fn: (input: Input) => Expected) =>
	(matcher: (result: Expected, expected: Expected) => void) =>
	(description: string, cases: { input: Input; expected: Expected; label?: string }[]) => {
		test(description, () => {
			cases.forEach(({ input, expected }) => {
				matcher(fn(input), expected);
			});
		});
	};

/**
 * Jest table-driven test runner for evaluating a function using Jest's `toBe` matcher.
 *
 * @param fn - The function to test.
 * @returns Curried function accepting description and cases.
 *
 * @example
 * const runJestTableTest = runJestExpectToBeTableTest(IsValueStringable);
 * runJestTableTest('Test primitives', [
 *   { input: 'foo', expected: true, label: 'string' },
 *   { input: 123, expected: true, label: 'number' },
 * ]);
 */
export const runExpectToBeTableTest = <Input, Expected>(fn: (input: Input) => Expected) =>
	runTableTestWithMatcher(fn)((result, expected) => {
		expect(result).toBe(expected);
	});
