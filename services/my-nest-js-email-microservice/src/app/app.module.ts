import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ConfigModule } from '@nestjs/config';
import { SmtpModule } from '../smtp/smtp.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), SmtpModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
