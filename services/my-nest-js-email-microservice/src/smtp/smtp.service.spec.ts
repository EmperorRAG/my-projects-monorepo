import { Test } from '@nestjs/testing';
import { SmtpService } from './smtp.service';
import { Transporter } from 'nodemailer';

describe('SmtpService', () => {
	let service: SmtpService;
	let mockTransport: jest.Mocked<Transporter>;

	beforeEach(async () => {
		mockTransport = {
			sendMail: jest.fn(),
		} as any;

		const module = await Test.createTestingModule({
			providers: [
				SmtpService,
				{
					provide: 'NODEMAILER_TRANSPORT',
					useValue: mockTransport,
				},
			],
		}).compile();

		service = module.get<SmtpService>(SmtpService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('sendEmail', () => {
		it('should delegate to injected transport', async () => {
			const mailOptions = {
				to: 'recipient@example.com',
				subject: 'Test',
				text: 'Test message',
			};
			const mockResult = { messageId: 'test-message-id' };
			mockTransport.sendMail.mockResolvedValue(mockResult);

			const result = await service.sendEmail(mailOptions);

			expect(mockTransport.sendMail).toHaveBeenCalledWith(mailOptions);
			expect(mockTransport.sendMail).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockResult);
		});

		it('should forward mail options exactly as provided', async () => {
			const mailOptions = {
				to: 'user@test.com',
				subject: 'Important Email',
				text: 'This is important',
				from: 'sender@example.com',
				cc: 'cc@example.com',
			};
			mockTransport.sendMail.mockResolvedValue({ messageId: 'id123' });

			await service.sendEmail(mailOptions);

			expect(mockTransport.sendMail).toHaveBeenCalledWith(
				expect.objectContaining({
					to: 'user@test.com',
					subject: 'Important Email',
					text: 'This is important',
					from: 'sender@example.com',
					cc: 'cc@example.com',
				}),
			);
		});

		it('should propagate promise rejection when transport fails', async () => {
			const mailOptions = {
				to: 'fail@example.com',
				subject: 'Test',
				text: 'Test',
			};
			const mockError = new Error('SMTP connection refused');
			mockTransport.sendMail.mockRejectedValue(mockError);

			await expect(service.sendEmail(mailOptions)).rejects.toThrow(
				'SMTP connection refused',
			);
			await expect(service.sendEmail(mailOptions)).rejects.toThrow(mockError);
		});

		it('should handle network timeout errors', async () => {
			const mailOptions = {
				to: 'timeout@example.com',
				subject: 'Timeout Test',
				text: 'This will timeout',
			};
			const timeoutError = new Error('Network timeout');
			mockTransport.sendMail.mockRejectedValue(timeoutError);

			await expect(service.sendEmail(mailOptions)).rejects.toThrow(
				'Network timeout',
			);
		});

		it('should handle authentication errors', async () => {
			const mailOptions = {
				to: 'auth@example.com',
				subject: 'Auth Test',
				text: 'Testing auth',
			};
			const authError = new Error('Invalid credentials');
			mockTransport.sendMail.mockRejectedValue(authError);

			await expect(service.sendEmail(mailOptions)).rejects.toThrow(
				'Invalid credentials',
			);
		});

		it('should return message info on successful send', async () => {
			const mailOptions = {
				to: 'success@example.com',
				subject: 'Success',
				text: 'Email sent',
			};
			const expectedInfo = {
				messageId: 'abc-123-def',
				accepted: ['success@example.com'],
				rejected: [],
				response: '250 OK',
			};
			mockTransport.sendMail.mockResolvedValue(expectedInfo);

			const result = await service.sendEmail(mailOptions);

			expect(result).toEqual(expectedInfo);
			expect(result.messageId).toBe('abc-123-def');
		});
	});
});
