import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SmtpService } from './smtp.service';

@Module({
  providers: [
    {
      provide: 'SMTP_TRANSPORT',
      useFactory: (configService: ConfigService) => {
        return nodemailer.createTransport({
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: configService.get<number>('SMTP_PORT') === 465, // true for 465, false for other ports
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        });
      },
      inject: [ConfigService],
    },
    SmtpService,
  ],
  exports: [SmtpService],
})
export class SmtpModule {}
