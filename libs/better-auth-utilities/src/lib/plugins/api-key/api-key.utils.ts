/**
 * @module api-key.utils
 * @description Provides utilities for interacting with the `better-auth` API Key plugin.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

import { Effect } from 'effect';

// ============================================================================
// Custom Error Classes
// ============================================================================

/**
 * Error thrown when API key creation fails.
 */
export class ApiKeyCreationError extends Error {
  readonly _tag = 'ApiKeyCreationError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ApiKeyCreationError';
  }
}

/**
 * Error thrown when API key validation fails.
 */
export class ApiKeyValidationError extends Error {
  readonly _tag = 'ApiKeyValidationError';

  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ApiKeyValidationError';
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Options for creating a new API key.
 */
export interface CreateApiKeyOptions {
  readonly name: string;
  readonly userId: string;
  readonly expiresIn?: number;
  readonly prefix?: string;
  readonly metadata?: Record<string, unknown> | null;
  readonly permissions?: Record<string, string[]>;
  readonly rateLimitEnabled?: boolean;
  readonly rateLimitTimeWindow?: number;
  readonly rateLimitMax?: number;
}

/**
 * Represents an API key returned from the better-auth API Key plugin.
 */
export interface ApiKey {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly userId: string;
  readonly createdAt: string;
  readonly expiresAt: string | null;
  readonly prefix: string;
  readonly remaining: number | null;
  readonly metadata: Record<string, unknown> | null;
  readonly permissions: Record<string, string[]> | null;
  readonly enabled?: boolean;
  readonly rateLimitEnabled?: boolean;
  readonly rateLimitTimeWindow?: number;
  readonly rateLimitMax?: number;
}

/**
 * Options for verifying an API key.
 */
export interface VerifyApiKeyOptions {
  readonly key: string;
  readonly permissions?: Record<string, string[]>;
}

/**
 * Result of API key verification.
 */
export interface ApiKeyVerificationResult {
  readonly isValid: boolean;
  readonly apiKey?: Omit<ApiKey, 'key'> | null;
}

/**
 * Configuration for API key operations.
 */
export interface ApiKeyConfig {
  readonly baseUrl: string;
  readonly createEndpoint?: string;
  readonly verifyEndpoint?: string;
}

// ============================================================================
// Supporting Utilities
// ============================================================================

/**
 * Builds the URL for the API key creation endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth API key creation endpoint.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional create endpoint.
 * @returns {string} The complete URL for the creation endpoint.
 *
 * @example
 * const url = buildCreateUrl({ baseUrl: 'http://localhost:3333' });
 * // => 'http://localhost:3333/api-key/create'
 */
export const buildCreateUrl = (config: ApiKeyConfig): string => {
  const endpoint = config.createEndpoint || '/api-key/create';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Builds the URL for the API key verification endpoint.
 *
 * @pure
 * @description Constructs the full URL for the better-auth API key verification endpoint.
 *
 * @fp-pattern Pure function
 * @composition N/A - Single operation
 *
 * @param config - Configuration containing the base URL and optional verify endpoint.
 * @returns {string} The complete URL for the verification endpoint.
 *
 * @example
 * const url = buildVerifyUrl({ baseUrl: 'http://localhost:3333' });
 * // => 'http://localhost:3333/api-key/verify'
 */
export const buildVerifyUrl = (config: ApiKeyConfig): string => {
  const endpoint = config.verifyEndpoint || '/api-key/verify';
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Validates API key creation options.
 *
 * @pure
 * @description Ensures required fields are present and valid.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition N/A - Single operation
 *
 * @param options - The API key creation options to validate.
 * @returns {Effect.Effect<CreateApiKeyOptions, ApiKeyCreationError>} Effect containing validated options or error.
 *
 * @example
 * const options = { name: 'My Key', userId: 'user-123' };
 * const validatedEffect = validateCreateOptions(options);
 * // Effect.runSync(validatedEffect) => { name: 'My Key', userId: 'user-123' }
 */
export const validateCreateOptions = (
  options: CreateApiKeyOptions
): Effect.Effect<CreateApiKeyOptions, ApiKeyCreationError> =>
  Effect.try({
    try: () => {
      if (!options.name || options.name.trim().length === 0) {
        throw new ApiKeyCreationError('API key name is required and cannot be empty');
      }
      if (!options.userId || options.userId.trim().length === 0) {
        throw new ApiKeyCreationError('User ID is required and cannot be empty');
      }
      return options;
    },
    catch: (error) =>
      error instanceof ApiKeyCreationError
        ? error
        : new ApiKeyCreationError('Failed to validate API key creation options', error),
  });

/**
 * Validates API key verification options.
 *
 * @pure
 * @description Ensures the API key string is present and valid.
 *
 * @fp-pattern Pure function returning Effect for validation
 * @composition N/A - Single operation
 *
 * @param options - The API key verification options to validate.
 * @returns {Effect.Effect<VerifyApiKeyOptions, ApiKeyValidationError>} Effect containing validated options or error.
 *
 * @example
 * const options = { key: 'project-api-key_abc123' };
 * const validatedEffect = validateVerifyOptions(options);
 * // Effect.runSync(validatedEffect) => { key: 'project-api-key_abc123' }
 */
export const validateVerifyOptions = (
  options: VerifyApiKeyOptions
): Effect.Effect<VerifyApiKeyOptions, ApiKeyValidationError> =>
  Effect.try({
    try: () => {
      if (!options.key || options.key.trim().length === 0) {
        throw new ApiKeyValidationError('API key is required and cannot be empty');
      }
      return options;
    },
    catch: (error) =>
      error instanceof ApiKeyValidationError
        ? error
        : new ApiKeyValidationError('Failed to validate API key verification options', error),
  });

// ============================================================================
// Main Utilities
// ============================================================================

/**
 * Creates a new API key.
 *
 * @description This function uses the `better-auth` API Key plugin to generate a new key.
 * The process is managed as an `Effect` to handle the underlying API call and potential errors.
 * The function makes a POST request to the `/api-key/create` endpoint with the provided options.
 *
 * Note: This is a server-only operation and requires proper authentication headers.
 *
 * @param options - The options for creating the API key, including name, userId, and optional configurations.
 * @param config - Configuration for the API endpoint, including base URL.
 * @returns {Effect.Effect<ApiKey, ApiKeyCreationError>} An `Effect` that resolves with the
 * new `ApiKey` object or fails with an `ApiKeyCreationError`.
 *
 * @example
 * const options = { name: 'My API Key', userId: 'user-123' };
 * const config = { baseUrl: 'http://localhost:3333' };
 * const apiKeyEffect = createApiKey(options, config);
 * const apiKey = await Effect.runPromise(apiKeyEffect);
 * // => { id: 'ak_...', key: 'project-api-key_...', name: 'My API Key', ... }
 *
 * @example
 * // Creating an API key with custom permissions and metadata
 * const options = {
 *   name: 'Project API Key',
 *   userId: 'user-456',
 *   permissions: { files: ['read', 'write'], users: ['read'] },
 *   metadata: { plan: 'premium' },
 *   expiresIn: 86400 // 1 day
 * };
 * const program = Effect.gen(function* () {
 *   const apiKey = yield* createApiKey(options, { baseUrl: 'http://localhost:3333' });
 *   return apiKey;
 * });
 */
export const createApiKey = (
  options: CreateApiKeyOptions,
  config: ApiKeyConfig
): Effect.Effect<ApiKey, ApiKeyCreationError> =>
  Effect.gen(function* () {
    // Validate the input options
    const validatedOptions = yield* validateCreateOptions(options);

    // Build the creation endpoint URL
    const url = buildCreateUrl(config);

    // Prepare the request body
    const requestBody = {
      name: validatedOptions.name,
      userId: validatedOptions.userId,
      ...(validatedOptions.expiresIn !== undefined && { expiresIn: validatedOptions.expiresIn }),
      ...(validatedOptions.prefix !== undefined && { prefix: validatedOptions.prefix }),
      ...(validatedOptions.metadata !== undefined && { metadata: validatedOptions.metadata }),
      ...(validatedOptions.permissions !== undefined && { permissions: validatedOptions.permissions }),
      ...(validatedOptions.rateLimitEnabled !== undefined && { rateLimitEnabled: validatedOptions.rateLimitEnabled }),
      ...(validatedOptions.rateLimitTimeWindow !== undefined && { rateLimitTimeWindow: validatedOptions.rateLimitTimeWindow }),
      ...(validatedOptions.rateLimitMax !== undefined && { rateLimitMax: validatedOptions.rateLimitMax }),
    };

    // Make the POST request to create the API key
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }),
      catch: (error) =>
        new ApiKeyCreationError(
          `Failed to send API key creation request to ${url}`,
          error
        ),
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new ApiKeyCreationError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new ApiKeyCreationError(
          `API key creation failed with status ${response.status}: ${errorText}`
        )
      );
    }

    // Parse the response JSON
    const apiKey = yield* Effect.tryPromise({
      try: () => response.json() as Promise<ApiKey>,
      catch: (error) =>
        new ApiKeyCreationError('Failed to parse API key creation response', error),
    });

    return apiKey;
  });

/**
 * Verifies an API key.
 *
 * @description This function validates an API key using the `better-auth` API Key plugin.
 * It makes a POST request to the `/api-key/verify` endpoint with the API key and optional permissions.
 * The function returns an `Effect` that resolves with a verification result object containing
 * the validity status and optional API key details.
 *
 * Note: This is a server-only operation.
 *
 * @param options - The verification options, including the API key and optional permissions to check.
 * @param config - Configuration for the API endpoint, including base URL.
 * @returns {Effect.Effect<ApiKeyVerificationResult, ApiKeyValidationError>} An `Effect` that resolves
 * with a verification result object or fails with an `ApiKeyValidationError`.
 *
 * @example
 * const options = { key: 'project-api-key_abc123' };
 * const config = { baseUrl: 'http://localhost:3333' };
 * const verifyEffect = verifyApiKey(options, config);
 * const result = await Effect.runPromise(verifyEffect);
 * // => { isValid: true, apiKey: { id: 'ak_...', userId: 'user-123', ... } }
 *
 * @example
 * // Verifying with specific permissions
 * const options = {
 *   key: 'project-api-key_xyz789',
 *   permissions: { files: ['read'] }
 * };
 * const program = Effect.gen(function* () {
 *   const result = yield* verifyApiKey(options, { baseUrl: 'http://localhost:3333' });
 *   if (result.isValid) {
 *     console.log('API key is valid and has required permissions');
 *   } else {
 *     console.log('API key is invalid or lacks permissions');
 *   }
 *   return result;
 * });
 */
export const verifyApiKey = (
  options: VerifyApiKeyOptions,
  config: ApiKeyConfig
): Effect.Effect<ApiKeyVerificationResult, ApiKeyValidationError> =>
  Effect.gen(function* () {
    // Validate the input options
    const validatedOptions = yield* validateVerifyOptions(options);

    // Build the verification endpoint URL
    const url = buildVerifyUrl(config);

    // Prepare the request body
    const requestBody = {
      key: validatedOptions.key,
      ...(validatedOptions.permissions !== undefined && { permissions: validatedOptions.permissions }),
    };

    // Make the POST request to verify the API key
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }),
      catch: (error) =>
        new ApiKeyValidationError(
          `Failed to send API key verification request to ${url}`,
          error
        ),
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: () => new ApiKeyValidationError('Failed to read error response'),
      });
      return yield* Effect.fail(
        new ApiKeyValidationError(
          `API key verification failed with status ${response.status}: ${errorText}`
        )
      );
    }

    // Parse the response JSON
    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<ApiKeyVerificationResult>,
      catch: (error) =>
        new ApiKeyValidationError('Failed to parse API key verification response', error),
    });

    return result;
  });
