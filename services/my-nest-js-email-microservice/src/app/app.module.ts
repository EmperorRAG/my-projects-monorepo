import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SmtpModule } from '../smtp/smtp.module';
import { HealthModule } from '../health/health.module';
import { validationSchema } from '../config/validation';
import { EmailController } from '../email/email.controller';
import { BetterAuthService } from '../auth/better-auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    SmtpModule,
    HealthModule,
  ],
  controllers: [AppController, EmailController],
  providers: [AppService, BetterAuthService],
})
export class AppModule {}
