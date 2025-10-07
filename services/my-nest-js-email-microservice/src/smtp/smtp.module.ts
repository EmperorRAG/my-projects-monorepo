import { Module } from '@nestjs/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { SmtpService } from './smtp.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'NODEMAILER_TRANSPORT',
      useFactory: (configService: ConfigService) => {
        return createTransport({
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
