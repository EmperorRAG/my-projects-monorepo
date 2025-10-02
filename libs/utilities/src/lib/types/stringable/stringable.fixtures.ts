import { getAllFunctionExpectedValues, getAllFunctionLabelValues, getAllFunctionValues } from '../../helper-functions/function.utils';
import { mergeObjects } from '../../helper-functions/mergeObjects.utils';
import { getAllObjectExpectedValues, getAllObjectLabelValues, getAllObjectValues } from '../../helper-functions/object.utils';
import { getAllPrimitiveExpectedValues, getAllPrimitiveLabelValues, getAllPrimitiveValues } from '../../helper-functions/primitive.utils';
import { toExpectedObjects, toInputObjects, toLabelObjects } from '../../helper-functions/toObjects.utils';
import type { InputLabelExpected } from '../test.types';

/**
 * Generates an array of expected objects for all primitive input-label combinations.
 *
 * This function combines arrays of input objects, label objects, and expected value objects
 * for all primitive values using the `mergeObjects` utility. The resulting array
 * conforms to the `InputLabelExpected[]` type.
 *
 * @returns {InputLabelExpected[]} An array of objects representing all primitive input-label-expected combinations.
 */
export const getAllPrimitiveInputLabelExpectedObjects = () =>
	mergeObjects(
		mergeObjects(toInputObjects(getAllPrimitiveValues()), toLabelObjects(getAllPrimitiveLabelValues())),
		toExpectedObjects(getAllPrimitiveExpectedValues())
	) satisfies InputLabelExpected[];

/**
 * Generates an array of objects that combine input, label, and expected value representations
 * for all function values, labels, and expected results. This is achieved by converting each
 * set of values into their respective object arrays and merging them using `mergeObjects`.
 * The resulting array conforms to the `InputLabelExpected[]` type.
 *
 * @returns {InputLabelExpected[]} An array of objects containing input, label, and expected value data.
 */
export const getAllFunctionInputLabelExpectedObjects = () =>
	mergeObjects(
		mergeObjects(toInputObjects(getAllFunctionValues()), toLabelObjects(getAllFunctionLabelValues())),
		toExpectedObjects(getAllFunctionExpectedValues())
	) satisfies InputLabelExpected[];

/**
 * Generates an array of objects that combine input values, label values, and expected values
 * for use in testing or fixtures. The function utilizes helper functions to transform
 * raw values into structured arrays and then merges them into a single array of objects
 * conforming to the `InputLabelExpected` type.
 *
 * @returns {InputLabelExpected[]} An array of objects each containing input, label, and expected value properties.
 */
export const getAllObjectInputLabelExpectedObjects = () =>
	mergeObjects(
		mergeObjects(toInputObjects(getAllObjectValues()), toLabelObjects(getAllObjectLabelValues())),
		toExpectedObjects(getAllObjectExpectedValues())
	) satisfies InputLabelExpected[];
