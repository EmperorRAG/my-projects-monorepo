import { validationSchema } from './validation';

describe('Config Validation Schema', () => {
	describe('validationSchema.validate', () => {
		it('should accept fully populated environment map', () => {
			const validEnv = {
				SMTP_HOST: 'smtp.example.com',
				SMTP_PORT: '587',
				SMTP_USER: 'user@example.com',
				SMTP_PASS: 'secret-password',
				API_KEY: 'test-api-key',
			};

			const { error, value } = validationSchema.validate(validEnv);

			expect(error).toBeUndefined();
			expect(value).toBeDefined();
			expect(value.SMTP_HOST).toBe('smtp.example.com');
			expect(value.SMTP_PORT).toBe(587); // Should be coerced to number
			expect(value.SMTP_USER).toBe('user@example.com');
			expect(value.SMTP_PASS).toBe('secret-password');
			expect(value.API_KEY).toBe('test-api-key');
		});

		it('should coerce SMTP_PORT to number', () => {
			const validEnv = {
				SMTP_HOST: 'smtp.example.com',
				SMTP_PORT: '25', // String representation
				SMTP_USER: 'user@example.com',
				SMTP_PASS: 'secret-password',
				API_KEY: 'test-api-key',
			};

			const { error, value } = validationSchema.validate(validEnv);

			expect(error).toBeUndefined();
			expect(typeof value.SMTP_PORT).toBe('number');
			expect(value.SMTP_PORT).toBe(25);
		});

		it('should produce descriptive error when SMTP_HOST is missing', () => {
			const invalidEnv = {
				// SMTP_HOST missing
				SMTP_PORT: '587',
				SMTP_USER: 'user@example.com',
				SMTP_PASS: 'secret-password',
				API_KEY: 'test-api-key',
			};

			const { error } = validationSchema.validate(invalidEnv);

			expect(error).toBeDefined();
			expect(error?.message).toMatch(/SMTP_HOST/i);
			expect(error?.message).toMatch(/required/i);
		});

		it('should produce descriptive error when SMTP_PORT is missing', () => {
			const invalidEnv = {
				SMTP_HOST: 'smtp.example.com',
				// SMTP_PORT missing
				SMTP_USER: 'user@example.com',
				SMTP_PASS: 'secret-password',
				API_KEY: 'test-api-key',
			};

			const { error } = validationSchema.validate(invalidEnv);

			expect(error).toBeDefined();
			expect(error?.message).toMatch(/SMTP_PORT/i);
			expect(error?.message).toMatch(/required/i);
		});

		it('should produce descriptive error when SMTP_USER is missing', () => {
			const invalidEnv = {
				SMTP_HOST: 'smtp.example.com',
				SMTP_PORT: '587',
				// SMTP_USER missing
				SMTP_PASS: 'secret-password',
				API_KEY: 'test-api-key',
			};

			const { error } = validationSchema.validate(invalidEnv);

			expect(error).toBeDefined();
			expect(error?.message).toMatch(/SMTP_USER/i);
			expect(error?.message).toMatch(/required/i);
		});

		it('should produce descriptive error when SMTP_PASS is missing', () => {
			const invalidEnv = {
				SMTP_HOST: 'smtp.example.com',
				SMTP_PORT: '587',
				SMTP_USER: 'user@example.com',
				// SMTP_PASS missing
				API_KEY: 'test-api-key',
			};

			const { error } = validationSchema.validate(invalidEnv);

			expect(error).toBeDefined();
			expect(error?.message).toMatch(/SMTP_PASS/i);
			expect(error?.message).toMatch(/required/i);
		});

		it('should produce descriptive error when API_KEY is missing', () => {
			const invalidEnv = {
				SMTP_HOST: 'smtp.example.com',
				SMTP_PORT: '587',
				SMTP_USER: 'user@example.com',
				SMTP_PASS: 'secret-password',
				// API_KEY missing
			};

			const { error } = validationSchema.validate(invalidEnv);

			expect(error).toBeDefined();
			expect(error?.message).toMatch(/API_KEY/i);
			expect(error?.message).toMatch(/required/i);
		});

		it('should produce error when SMTP_PORT is not a valid number', () => {
			const invalidEnv = {
				SMTP_HOST: 'smtp.example.com',
				SMTP_PORT: 'not-a-number',
				SMTP_USER: 'user@example.com',
				SMTP_PASS: 'secret-password',
				API_KEY: 'test-api-key',
			};

			const { error } = validationSchema.validate(invalidEnv);

			expect(error).toBeDefined();
			expect(error?.message).toMatch(/SMTP_PORT/i);
			expect(error?.message).toMatch(/number/i);
		});

		it('should produce error for multiple missing required keys', () => {
			const invalidEnv = {
				SMTP_HOST: 'smtp.example.com',
				// Missing multiple required fields
			};

			const { error } = validationSchema.validate(invalidEnv);

			expect(error).toBeDefined();
			// Should mention at least one of the missing keys
			const message = error?.message || '';
			const hasMissingKey =
				message.match(/SMTP_PORT/i) ||
				message.match(/SMTP_USER/i) ||
				message.match(/SMTP_PASS/i) ||
				message.match(/API_KEY/i);
			expect(hasMissingKey).toBeTruthy();
		});
	});
});
