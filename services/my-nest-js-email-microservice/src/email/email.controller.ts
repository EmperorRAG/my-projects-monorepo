import { Body, Controller, Post, UseGuards, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AppService } from '../app/app.service';
import { SendEmailDto } from '../app/dto/send-email.dto';

// NOTE: The S2SAuthGuard is a placeholder for now.
// It will be fully implemented in the 'service-to-service-authentication' feature.
import { S2SAuthGuard } from '../auth/s2s-auth.guard';

@ApiTags('email')
@ApiBearerAuth()
@UseGuards(S2SAuthGuard)
@Controller('email')
export class EmailController {
  constructor(private readonly appService: AppService) {}

  @Post('send')
  @HttpCode(202)
  @ApiOperation({
    summary: 'Send an email',
    description:
      'Sends an email to the specified recipient with the provided subject and body content. This is an asynchronous operation that returns immediately with a 202 Accepted status.',
  })
  @ApiBody({
    type: SendEmailDto,
    description: 'Email details including recipient, subject, and body',
  })
  @ApiResponse({
    status: 202,
    description: 'Email has been queued for sending and will be processed asynchronously.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body or validation failed.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing API key.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred while processing the request.',
  })
  sendEmail(@Body() sendEmailDto: SendEmailDto): void {
    this.appService.sendTestEmail(sendEmailDto);
  }
}
