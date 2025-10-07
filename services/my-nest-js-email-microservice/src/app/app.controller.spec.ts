import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SmtpService } from '../smtp/smtp.service';

describe('AppController', () => {
	let app: TestingModule;
	let appController: AppController;

	const mockSmtpService = {
		sendEmail: jest.fn(),
	};

	beforeAll(async () => {
		app = await Test.createTestingModule({
			controllers: [AppController],
			providers: [
				AppService,
				{
					provide: SmtpService,
					useValue: mockSmtpService,
				},
			],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	describe('sendTestEmail', () => {
		it('should call appService.sendTestEmail', async () => {
			await appController.sendTestEmail();
			expect(mockSmtpService.sendEmail).toHaveBeenCalledWith({
				to: 'test@example.com',
				subject: 'Test Email',
				text: 'This is a test email.',
			});
		});
	});
});
