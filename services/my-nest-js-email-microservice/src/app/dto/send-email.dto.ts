import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    description: 'The recipient email address',
    example: 'recipient@example.com',
    type: String,
    format: 'email',
  })
  @IsEmail(
    {},
    { message: 'A valid email address must be provided for the "to" field.' },
  )
  @IsNotEmpty({ message: 'The "to" field cannot be empty.' })
  to!: string;

  @ApiProperty({
    description: 'The email subject line',
    example: 'Welcome to Our Service',
    type: String,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({
    description: 'The email body content',
    example: 'Thank you for signing up! We are excited to have you on board.',
    type: String,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  body!: string;
}
