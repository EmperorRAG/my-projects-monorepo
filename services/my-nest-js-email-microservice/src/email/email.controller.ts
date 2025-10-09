import { Body, Controller, Post, UseGuards, HttpCode } from '@nestjs/common';
import { AppService } from '../app/app.service';
import { SendEmailDto } from '../app/dto/send-email.dto';

// NOTE: The S2SAuthGuard is a placeholder for now.
// It will be fully implemented in the 'service-to-service-authentication' feature.
import { S2SAuthGuard } from '../auth/s2s-auth.guard';

@UseGuards(S2SAuthGuard)
@Controller('email')
export class EmailController {
  constructor(private readonly appService: AppService) {}

  @Post('send')
  @HttpCode(202)
  sendEmail(@Body() sendEmailDto: SendEmailDto): void {
    this.appService.sendTestEmail(sendEmailDto);
  }
}
