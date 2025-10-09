import { test, expect } from '@jest/globals';
import { pipe } from 'effect';
import { forEach } from 'effect/Array';

type TestCase<Input, Expected> = {
	input: Input;
	expected: Expected;
	label?: string;
};

/**
 * A higher-order function that creates a table-driven test runner with a custom matcher.
 *
 * @impure This function is impure as it interacts with the Jest test runner.
 * @description Creates a curried function to run a series of test cases for a given function `fn`.
 * It first takes a `matcher` function, then a `description`, and finally the `cases`.
 *
 * @fp-pattern Higher-order function, Curried function
 *
 * @param fn - The function to be tested.
 * @returns A curried function for running table-driven tests.
 *
 * @example
 * const add = (a: number) => (b: number) => a + b;
 * const testAdd = runTableTestWithMatcher(add(1));
 * testAdd((result, expected) => expect(result).toBe(expected))(
 *   'should add numbers',
 *   [{ input: 2, expected: 3 }]
 * );
 */
export const runTableTestWithMatcher =
	<Input, Expected>(fn: (input: Input) => Expected) =>
	(matcher: (result: Expected, expected: Expected) => void) =>
	(description: string, cases: ReadonlyArray<TestCase<Input, Expected>>) => {
		test(description, () => {
			pipe(
				cases,
				forEach(({ input, expected }) => {
					matcher(fn(input), expected);
				})
			);
		});
	};

/**
 * A higher-order function that creates a table-driven test runner using Jest's `toBe` matcher.
 *
 * @impure This function is impure as it delegates to `runTableTestWithMatcher`.
 * @description A specialized version of `runTableTestWithMatcher` that defaults to using `expect(result).toBe(expected)`.
 *
 * @fp-pattern Higher-order function, Curried function
 *
 * @param fn - The function to be tested.
 * @returns A curried function for running table-driven tests with the `toBe` matcher.
 *
 * @example
 * const add = (a: number) => (b: number) => a + b;
 * const testAdd = runExpectToBeTableTest(add(1));
 * testAdd('should add numbers', [{ input: 2, expected: 3 }]);
 */
export const runExpectToBeTableTest = <Input, Expected>(fn: (input: Input) => Expected) =>
	runTableTestWithMatcher(fn)((result, expected) => {
		expect(result).toBe(expected);
	});
