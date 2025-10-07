import { Injectable } from '@nestjs/common';
import { SmtpService } from '../smtp/smtp.service';

@Injectable()
export class AppService {
	constructor(private readonly smtpService: SmtpService) {}

	async sendTestEmail(): Promise<void> {
		await this.smtpService.sendEmail({
			to: 'test@example.com',
			subject: 'Test Email',
			text: 'This is a test email.',
		});
	}
}
