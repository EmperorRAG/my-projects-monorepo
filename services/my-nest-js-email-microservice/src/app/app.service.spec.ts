import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { SmtpService } from '../smtp/smtp.service';

describe('AppService', () => {
	let service: AppService;
	const mockSmtpService = {
		sendEmail: jest.fn(),
	};

	beforeAll(async () => {
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
	});

	describe('sendTestEmail', () => {
		it('should call smtpService.sendEmail', async () => {
			await service.sendTestEmail();
			expect(mockSmtpService.sendEmail).toHaveBeenCalledWith({
				to: 'test@example.com',
				subject: 'Test Email',
				text: 'This is a test email.',
			});
		});
	});
});
