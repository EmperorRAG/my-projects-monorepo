/**
 * Represents an object with an input value, a label, and an expected boolean result.
 *
 * @property input - The value to be tested or used as input. Can be any type.
 * @property label - A string label describing the input.
 * @property expected - The expected boolean result for the input.
 */
export interface InputLabelExpected {
	input: unknown;
	label: string;
	expected: boolean;
}
