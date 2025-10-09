import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { SmtpService } from '../smtp/smtp.service';
import { validSendEmailDto, cloneDto } from '../../test/fixtures/email';

describe('AppService', () => {
	let service: AppService;
	let mockSmtpService: jest.Mocked<SmtpService>;
	let loggerLogSpy: jest.SpyInstance;
	let loggerErrorSpy: jest.SpyInstance;

	beforeEach(async () => {
		mockSmtpService = {
			sendEmail: jest.fn(),
		} as any;

		const app = await Test.createTestingModule({
			providers: [
				AppService,
				{
					provide: SmtpService,
					useValue: mockSmtpService,
				},
			],
		}).compile();

		service = app.get<AppService>(AppService);

		// Spy on Logger methods
		loggerLogSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
		loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('sendTestEmail', () => {
		it('should call smtpService.sendEmail with DTO-derived values', async () => {
			const dto = cloneDto(validSendEmailDto);
			const mockResult = { messageId: 'mock-message-id-123' };
			mockSmtpService.sendEmail.mockResolvedValue(mockResult);

			await service.sendTestEmail(dto);

			expect(mockSmtpService.sendEmail).toHaveBeenCalledWith({
				to: dto.to,
				subject: dto.subject,
				text: dto.body,
			});
			expect(mockSmtpService.sendEmail).toHaveBeenCalledTimes(1);
		});

		it('should log success message when email is sent', async () => {
			const dto = cloneDto(validSendEmailDto);
			const mockResult = { messageId: 'mock-message-id-456' };
			mockSmtpService.sendEmail.mockResolvedValue(mockResult);

			await service.sendTestEmail(dto);

			expect(loggerLogSpy).toHaveBeenCalledWith(
				expect.stringContaining('Email sent successfully'),
			);
			expect(loggerLogSpy).toHaveBeenCalledWith(
				expect.stringContaining(dto.to),
			);
			expect(loggerLogSpy).toHaveBeenCalledWith(
				expect.stringContaining(dto.subject),
			);
			expect(loggerLogSpy).toHaveBeenCalledWith(
				expect.stringContaining('mock-message-id-456'),
			);
		});

		it('should log error when smtpService.sendEmail fails', async () => {
			const dto = cloneDto(validSendEmailDto);
			const mockError = new Error('SMTP connection failed');
			mockSmtpService.sendEmail.mockRejectedValue(mockError);

			await service.sendTestEmail(dto);

			expect(loggerErrorSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to send email'),
				expect.anything(),
			);
			expect(loggerErrorSpy).toHaveBeenCalledWith(
				expect.stringContaining(dto.to),
				expect.anything(),
			);
			expect(loggerErrorSpy).toHaveBeenCalledWith(
				expect.stringContaining(dto.subject),
				expect.anything(),
			);
		});

		it('should not throw error when smtpService.sendEmail rejects', async () => {
			const dto = cloneDto(validSendEmailDto);
			const mockError = new Error('Network timeout');
			mockSmtpService.sendEmail.mockRejectedValue(mockError);

			await expect(service.sendTestEmail(dto)).resolves.not.toThrow();
		});

		it('should handle different email addresses correctly', async () => {
			const dto = {
				to: 'custom@test.com',
				subject: 'Custom Subject',
				body: 'Custom Body',
			};
			const mockResult = { messageId: 'custom-id' };
			mockSmtpService.sendEmail.mockResolvedValue(mockResult);

			await service.sendTestEmail(dto);

			expect(mockSmtpService.sendEmail).toHaveBeenCalledWith({
				to: 'custom@test.com',
				subject: 'Custom Subject',
				text: 'Custom Body',
			});
		});
	});
});
