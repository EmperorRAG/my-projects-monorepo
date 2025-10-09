import { SendEmailDto } from '../../src/app/dto/send-email.dto';

/**
 * Valid token for authentication tests
 */
export const validToken = 'valid-token';

/**
 * Invalid token for authentication tests
 */
export const invalidToken = 'invalid-token';

/**
 * Valid SendEmailDto payload for testing
 */
export const validSendEmailDto: SendEmailDto = {
	to: 'test@example.com',
	subject: 'Test Subject',
	body: 'Test email body content',
};

/**
 * Invalid SendEmailDto with invalid email format
 */
export const invalidEmailDto = {
	to: 'not-an-email',
	subject: 'Test Subject',
	body: 'Test email body content',
};

/**
 * SendEmailDto with missing required fields
 */
export const incompleteSendEmailDto = {
	to: 'test@example.com',
	// missing subject and body
};

/**
 * Helper to clone DTOs for mutation-free test scenarios
 */
export const cloneDto = <T>(dto: T): T => {
	return JSON.parse(JSON.stringify(dto));
};
