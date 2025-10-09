import { Injectable, Logger } from '@nestjs/common';
import { SmtpService } from '../smtp/smtp.service';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly smtpService: SmtpService) {}

  async sendTestEmail(sendEmailDto: SendEmailDto): Promise<void> {
    const { to, subject } = sendEmailDto;

    try {
      const result = await this.smtpService.sendEmail({
        to: sendEmailDto.to,
        subject: sendEmailDto.subject,
        text: sendEmailDto.body,
      });
      this.logger.log(
        `Email sent successfully to: ${to}, subject: ${subject}, messageId: ${result.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send email to: ${to}, subject: ${subject}`,
        (error as Error).stack,
      );
    }
  }
}
