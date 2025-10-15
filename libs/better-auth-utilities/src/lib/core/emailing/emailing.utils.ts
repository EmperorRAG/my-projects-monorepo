/**
 * @module emailing.utils
 * @description Provides core utilities for handling emails in better-auth.
 * These functions are designed using the Effect-TS functional programming paradigm.
 */

import { Context, Effect, pipe } from 'effect';

/**
 * Error type for email service failures.
 */
export class EmailServiceError {
  readonly _tag = 'EmailServiceError';
  constructor(
    readonly message: string,
    readonly cause?: unknown
  ) {}
}

/**
 * Error type for invalid email data.
 */
export class InvalidEmailDataError {
  readonly _tag = 'InvalidEmailDataError';
  constructor(readonly message: string) {}
}

/**
 * Email service interface for dependency injection.
 */
export interface EmailService {
  readonly sendEmail: (params: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
  }) => Effect.Effect<void, EmailServiceError>;
}

/**
 * Tag for the EmailService using Context.Tag pattern.
 */
export class EmailServiceTag extends Context.Tag('EmailService')<
  EmailServiceTag,
  EmailService
>() {}

/**
 * User type for email operations.
 */
export interface User {
  readonly email: string;
  readonly name?: string;
  readonly id: string;
}

/**
 * Verification email data.
 */
export interface VerificationEmailData {
  readonly user: User;
  readonly token: string;
  readonly url: string;
}

/**
 * Validates user email data.
 *
 * @pure
 * @description Checks if the user object contains a valid email address.
 *
 * @param user - The user object to validate.
 * @returns {Effect.Effect<User, InvalidEmailDataError, never>} An `Effect` that succeeds with the user
 * if valid, or fails with `InvalidEmailDataError`.
 */
export const validateUserEmail = (
  user: User
): Effect.Effect<User, InvalidEmailDataError, never> =>
  Effect.try({
    try: () => {
      if (!user.email || typeof user.email !== 'string') {
        throw new InvalidEmailDataError('User email is required and must be a string');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        throw new InvalidEmailDataError('Invalid email format');
      }
      return user;
    },
    catch: (error) =>
      error instanceof InvalidEmailDataError
        ? error
        : new InvalidEmailDataError('Unknown validation error'),
  });

/**
 * Constructs the verification URL from the base URL and token.
 *
 * @pure
 * @description Builds the full verification URL that will be sent to the user.
 *
 * @param baseUrl - The base URL of the application.
 * @param token - The verification token.
 * @returns {string} The complete verification URL.
 *
 * @example
 * const url = buildVerificationUrl('https://example.com', 'abc123');
 * // => 'https://example.com/api/auth/verify-email?token=abc123'
 */
export const buildVerificationUrl = (baseUrl: string, token: string): string =>
  `${baseUrl}/api/auth/verify-email?token=${token}`;

/**
 * Constructs the HTML content for the verification email.
 *
 * @pure
 * @description Generates the HTML body of the verification email with the user's name and verification link.
 *
 * @param userName - The name of the user (optional).
 * @param verificationUrl - The verification URL.
 * @returns {string} The HTML content for the email.
 *
 * @example
 * const html = buildVerificationEmailHtml('John', 'https://example.com/verify?token=xyz');
 * // => HTML string with personalized content
 */
export const buildVerificationEmailHtml = (
  userName: string | undefined,
  verificationUrl: string
): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
    <h1 style="color: #2c3e50; margin-bottom: 20px;">Verify Your Email Address</h1>
    <p style="margin-bottom: 15px;">
      ${userName ? `Hi ${userName},` : 'Hello,'}
    </p>
    <p style="margin-bottom: 15px;">
      Thank you for signing up! Please verify your email address by clicking the button below:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}"
         style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
        Verify Email Address
      </a>
    </div>
    <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
      Or copy and paste this link into your browser:
    </p>
    <p style="word-break: break-all; color: #3498db; font-size: 14px;">
      ${verificationUrl}
    </p>
    <p style="margin-top: 30px; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px;">
      If you didn't create an account, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
`;

/**
 * Constructs the plain text content for the verification email.
 *
 * @pure
 * @description Generates the plain text body of the verification email as a fallback for HTML.
 *
 * @param userName - The name of the user (optional).
 * @param verificationUrl - The verification URL.
 * @returns {string} The plain text content for the email.
 */
export const buildVerificationEmailText = (
  userName: string | undefined,
  verificationUrl: string
): string =>
  `${userName ? `Hi ${userName}` : 'Hello'},

Thank you for signing up! Please verify your email address by visiting the following link:

${verificationUrl}

If you didn't create an account, you can safely ignore this email.`;

/**
 * Sends a verification email to a user.
 *
 * @description This function constructs and sends a verification email to the user.
 * The process is managed as an `Effect` to handle the side effect of sending an email
 * and to manage potential failures in the email service.
 *
 * @fp-pattern Effect composition with pipe
 * @composition
 *   - `pipe(validateUserEmail(user), Effect.flatMap(sendEmail))`
 *
 * @param data - The verification email data containing user, token, and URL.
 * @returns {Effect.Effect<void, EmailServiceError | InvalidEmailDataError, EmailService>} An `Effect` that, when run,
 * sends the email. It completes with `void` on success and fails with an `EmailServiceError` or `InvalidEmailDataError` on failure.
 * It requires an `EmailService` in its context.
 *
 * @example
 * const data: VerificationEmailData = {
 *   user: { id: '1', email: 'user@example.com', name: 'John Doe' },
 *   token: 'verification-token-123',
 *   url: 'https://example.com'
 * };
 * const program = sendVerificationEmail(data);
 *
 * // Provide the EmailService implementation
 * const result = Effect.runPromise(
 *   Effect.provide(program, EmailService.of({
 *     sendEmail: (params) => Effect.tryPromise({
 *       try: () => yourEmailService.send(params),
 *       catch: (error) => new EmailServiceError('Failed to send email', error)
 *     })
 *   }))
 * );
 */
export const sendVerificationEmail = (
  data: VerificationEmailData
): Effect.Effect<void, EmailServiceError | InvalidEmailDataError, EmailServiceTag> =>
  pipe(
    validateUserEmail(data.user),
    Effect.flatMap((validatedUser) =>
      Effect.gen(function* () {
        const emailService = yield* EmailServiceTag;
        const verificationUrl = buildVerificationUrl(data.url, data.token);
        const htmlContent = buildVerificationEmailHtml(validatedUser.name, verificationUrl);
        const textContent = buildVerificationEmailText(validatedUser.name, verificationUrl);

        return yield* emailService.sendEmail({
          to: validatedUser.email,
          subject: 'Verify Your Email Address',
          html: htmlContent,
          text: textContent,
        });
      })
    )
  );
