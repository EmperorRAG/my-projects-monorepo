import { runExpectToBeTableTest } from '../../helper-functions/runTableTest.utils';
import {
	getAllFunctionInputLabelExpectedObjects,
	getAllObjectInputLabelExpectedObjects,
	getAllPrimitiveInputLabelExpectedObjects,
} from './stringable.fixtures';
import { isValuePrimitiveStringable, isValueStringable } from './stringable.types';

const runExpectToBeTableTestIsValueStringable = runExpectToBeTableTest(isValueStringable);

const runExpectToBeTableTestIsPrimitiveValueStringable = runExpectToBeTableTest(isValuePrimitiveStringable);

/**
 * Unit test: Verifies that IsValueStringable returns true for all primitive types.
 *
 * This test ensures that the function correctly identifies all JavaScript primitive values as stringable, as required by the acceptance criteria.
 * Steps:
 * 1. Define a set of primitive values (string, number, boolean, undefined, null, symbol, bigint).
 * 2. For each value, assert that IsValueStringable returns true.
 */
runExpectToBeTableTestIsValueStringable('IsValueStringable returns true for all primitive types', getAllPrimitiveInputLabelExpectedObjects());

/**
 * Unit test: Verifies that IsValueStringable returns true for various object types.
 *
 * This test covers plain objects, arrays, Date instances, and RegExp objects, ensuring that all are recognized as stringable.
 * Steps:
 * 1. Define a set of object values.
 * 2. For each value, assert that IsValueStringable returns true.
 */
runExpectToBeTableTestIsValueStringable('IsValueStringable returns true for objects', getAllObjectInputLabelExpectedObjects());

/**
 * Unit test: Verifies that IsValueStringable returns true for functions.
 *
 * This test ensures that both arrow functions and named functions are considered stringable.
 * Steps:
 * 1. Define an arrow function and a named function.
 * 2. For each, assert that IsValueStringable returns true.
 */
runExpectToBeTableTestIsValueStringable('IsValueStringable returns true for functions', getAllFunctionInputLabelExpectedObjects());

/**
 * Unit test: Verifies that IsValuePrimitiveStringable returns true for all primitive types.
 *
 * This test ensures that the function correctly identifies all JavaScript primitive values as primitive stringable, as required by the acceptance criteria.
 * Steps:
 * 1. Define a set of primitive values (string, number, boolean, undefined, null, symbol, bigint).
 * 2. For each value, assert that IsValuePrimitiveStringable returns true.
 */
runExpectToBeTableTestIsPrimitiveValueStringable('IsValuePrimitiveStringable returns true for all primitive types', getAllPrimitiveInputLabelExpectedObjects());

/**
 * Unit test: Verifies that IsValuePrimitiveStringable returns false for various object types.
 *
 * This test covers plain objects, arrays, Date instances, and RegExp objects, ensuring that all are recognized as NOT primitive stringable.
 * Steps:
 * 1. Define a set of object values.
 * 2. For each value, assert that IsValuePrimitiveStringable returns false.
 */
runExpectToBeTableTestIsPrimitiveValueStringable(
	'IsValuePrimitiveStringable returns false for objects',
	getAllObjectInputLabelExpectedObjects().map((obj) => ({ ...obj, expected: false }))
);

/**
 * Unit test: Verifies that IsValuePrimitiveStringable returns false for functions.
 *
 * This test ensures that both arrow functions and named functions are considered NOT primitive stringable.
 * Steps:
 * 1. Define an arrow function and a named function.
 * 2. For each, assert that IsValuePrimitiveStringable returns false.
 */
runExpectToBeTableTestIsPrimitiveValueStringable(
	'IsValuePrimitiveStringable returns false for functions',
	getAllFunctionInputLabelExpectedObjects().map((obj) => ({ ...obj, expected: false }))
);
