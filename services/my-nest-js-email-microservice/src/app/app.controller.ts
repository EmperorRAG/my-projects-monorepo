import { Controller, Post, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post('send-test-email')
	@HttpCode(202)
	sendTestEmail(): void {
		this.appService.sendTestEmail();
	}
}
