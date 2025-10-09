import { validate } from 'class-validator';
import { SendEmailDto } from './send-email.dto';
import {
	validSendEmailDto,
	invalidEmailDto,
	incompleteSendEmailDto,
	cloneDto,
} from '../../../test/fixtures/email';

describe('SendEmailDto', () => {
	describe('validation', () => {
		it('should pass validation for valid payload', async () => {
			const dto = Object.assign(new SendEmailDto(), cloneDto(validSendEmailDto));
			const errors = await validate(dto);
			expect(errors).toHaveLength(0);
		});

		it('should fail validation for invalid email format', async () => {
			const dto = Object.assign(new SendEmailDto(), invalidEmailDto);
			const errors = await validate(dto);

			expect(errors).toHaveLength(1);
			expect(errors[0].property).toBe('to');
			expect(errors[0].constraints).toHaveProperty('isEmail');
			expect(errors[0].constraints?.isEmail).toContain(
				'A valid email address must be provided for the "to" field',
			);
		});

		it('should fail validation when "to" field is empty', async () => {
			const dto = Object.assign(new SendEmailDto(), {
				to: '',
				subject: 'Test',
				body: 'Test body',
			});
			const errors = await validate(dto);

			expect(errors.length).toBeGreaterThan(0);
			const toError = errors.find((e) => e.property === 'to');
			expect(toError).toBeDefined();
			expect(toError?.constraints).toHaveProperty('isNotEmpty');
			expect(toError?.constraints?.isNotEmpty).toContain(
				'The "to" field cannot be empty',
			);
		});

		it('should fail validation when subject is missing', async () => {
			const dto = Object.assign(new SendEmailDto(), {
				to: 'test@example.com',
				body: 'Test body',
			});
			const errors = await validate(dto);

			expect(errors.length).toBeGreaterThan(0);
			const subjectError = errors.find((e) => e.property === 'subject');
			expect(subjectError).toBeDefined();
			expect(subjectError?.constraints).toHaveProperty('isNotEmpty');
		});

		it('should fail validation when body is missing', async () => {
			const dto = Object.assign(new SendEmailDto(), {
				to: 'test@example.com',
				subject: 'Test Subject',
			});
			const errors = await validate(dto);

			expect(errors.length).toBeGreaterThan(0);
			const bodyError = errors.find((e) => e.property === 'body');
			expect(bodyError).toBeDefined();
			expect(bodyError?.constraints).toHaveProperty('isNotEmpty');
		});

		it('should fail validation for multiple missing required fields', async () => {
			const dto = Object.assign(
				new SendEmailDto(),
				incompleteSendEmailDto,
			);
			const errors = await validate(dto);

			expect(errors.length).toBeGreaterThan(0);
			const properties = errors.map((e) => e.property);
			expect(properties).toContain('subject');
			expect(properties).toContain('body');
		});

		it('should fail validation when subject is not a string', async () => {
			const dto = Object.assign(new SendEmailDto(), {
				to: 'test@example.com',
				subject: 123, // number instead of string
				body: 'Test body',
			});
			const errors = await validate(dto);

			expect(errors.length).toBeGreaterThan(0);
			const subjectError = errors.find((e) => e.property === 'subject');
			expect(subjectError).toBeDefined();
			expect(subjectError?.constraints).toHaveProperty('isString');
		});

		it('should fail validation when body is not a string', async () => {
			const dto = Object.assign(new SendEmailDto(), {
				to: 'test@example.com',
				subject: 'Test Subject',
				body: null, // null instead of string
			});
			const errors = await validate(dto);

			expect(errors.length).toBeGreaterThan(0);
			const bodyError = errors.find((e) => e.property === 'body');
			expect(bodyError).toBeDefined();
			expect(bodyError?.constraints).toHaveProperty('isString');
		});
	});
});
