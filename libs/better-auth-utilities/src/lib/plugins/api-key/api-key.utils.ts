/**
 * @module api-key.utils
 * @description Provides utilities for interacting with the `better-auth` API Key plugin.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

// AI-GENERATED FILE - DO NOT EDIT

// @ai-prompt
// Implement a utility function `createApiKey` using Effect-TS.
// 1.  The function should accept options for the new API key, such as `name` and `userId`.
// 2.  It should use the `better-auth` API Key plugin to create a new key.
// 3.  This is an effectful operation.
// 4.  The `Effect` should succeed with the newly created API key object.
// 5.  It should fail with an `ApiKeyCreationError`.
// 6.  Follow the JSDoc template for effectful functions.
/**
 * Creates a new API key.
 *
 * @description This function uses the `better-auth` API Key plugin to generate a new key.
 * The process is managed as an `Effect` to handle the underlying API call and potential errors.
 *
 * @param options - The options for creating the API key, such as name and userId.
 * @returns {Effect.Effect<ApiKey, ApiKeyCreationError, ApiKeyService>} An `Effect` that resolves with the
 * new `ApiKey` object or fails with an error. Requires an `ApiKeyService` in its context.
 */
export const createApiKey = (options: { name: string; userId: string }) => {
  // AI, implement the function here.
};

// @ai-prompt
// Implement a utility function `verifyApiKey` using Effect-TS.
// 1.  The function should accept an API key string.
// 2.  It should use the `better-auth` API Key plugin to verify the key.
// 3.  This is an effectful operation.
// 4.  The `Effect` should succeed with a boolean indicating if the key is valid.
// 5.  It should fail with an `ApiKeyValidationError`.
// 6.  Follow the JSDoc template for effectful functions.
/**
 * Verifies an API key.
 *
 * @description This function validates an API key using the `better-auth` API Key plugin.
 * It returns an `Effect` that resolves to `true` if the key is valid and `false` otherwise,
 * or fails with a validation error.
 *
 * @param apiKey - The API key string to verify.
 * @returns {Effect.Effect<boolean, ApiKeyValidationError, ApiKeyService>} An `Effect` that resolves
 * with a boolean indicating the validity of the key. Requires an `ApiKeyService` in its context.
 */
export const verifyApiKey = (apiKey: string) => {
  // AI, implement the function here.
};
