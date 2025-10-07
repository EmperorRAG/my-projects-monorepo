import { Inject, Injectable } from '@nestjs/common';
import { type Transporter, SendMailOptions } from 'nodemailer';

@Injectable()
export class SmtpService {
  constructor(
    @Inject('NODEMAILER_TRANSPORT') private readonly transport: Transporter,
  ) {}

  async sendEmail(options: SendMailOptions) {
    return this.transport.sendMail(options);
  }
}
