/**
 * @file libs/better-auth-utilities/src/lib/adapters/base/plugin-adapter.interface.ts
 * @description Base interfaces and types for better-auth plugin adapters.
 * Defines contracts for server API wrappers and NestJS integration.
 */

import type { betterAuth } from 'better-auth';

/**
 * Base interface for all plugin adapters.
 * Provides common structure and metadata for plugin functionality.
 */
export interface PluginAdapter<TServerAPI = unknown> {
  /**
   * Unique identifier for the plugin (matches better-auth plugin ID).
   */
  readonly pluginId: string;

  /**
   * Human-readable name of the plugin.
   */
  readonly pluginName: string;

  /**
   * Server API instance providing plugin-specific methods.
   * Type varies based on the plugin.
   */
  readonly api: TServerAPI;

  /**
   * Checks if the plugin is properly initialized and available.
   */
  isAvailable(): boolean;
}

/**
 * Context object passed to adapter methods, containing request information.
 */
export interface AdapterContext {
  /**
   * HTTP request headers (for session, authentication, etc.).
   */
  headers?: Headers | Record<string, string>;

  /**
   * User session data (if available).
   */
  session?: {
    user: {
      id: string;
      email: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };

  /**
   * Additional context data.
   */
  [key: string]: unknown;
}

/**
 * Standard response wrapper for adapter methods.
 */
export interface AdapterResponse<TData = unknown, TError = unknown> {
  /**
   * Response data (if successful).
   */
  data?: TData;

  /**
   * Error information (if failed).
   */
  error?: TError;

  /**
   * Indicates if the operation was successful.
   */
  success: boolean;

  /**
   * Optional message describing the result.
   */
  message?: string;
}

/**
 * Configuration options for creating a plugin adapter.
 */
export interface AdapterConfig<TAuth = ReturnType<typeof betterAuth>> {
  /**
   * Better-auth server instance.
   */
  auth: TAuth;

  /**
   * Plugin-specific configuration options.
   */
  pluginOptions?: Record<string, unknown>;

  /**
   * Enable debug logging.
   */
  debug?: boolean;
}

/**
 * Base error class for adapter-related errors.
 */
export class AdapterError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AdapterError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when a plugin is not available or not properly configured.
 */
export class PluginNotAvailableError extends AdapterError {
  constructor(pluginName: string, reason?: string) {
    super(
      `Plugin "${pluginName}" is not available${reason ? `: ${reason}` : ''}`,
      'PLUGIN_NOT_AVAILABLE',
      503
    );
    this.name = 'PluginNotAvailableError';
  }
}

/**
 * Error thrown when an adapter operation fails.
 */
export class AdapterOperationError extends AdapterError {
  constructor(
    operation: string,
    message: string,
    details?: unknown
  ) {
    super(
      `Operation "${operation}" failed: ${message}`,
      'ADAPTER_OPERATION_FAILED',
      500,
      details
    );
    this.name = 'AdapterOperationError';
  }
}
