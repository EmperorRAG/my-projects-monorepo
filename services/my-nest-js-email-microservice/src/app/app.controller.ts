import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post('send-test-email')
	async sendTestEmail(): Promise<void> {
		return this.appService.sendTestEmail();
	}
}
