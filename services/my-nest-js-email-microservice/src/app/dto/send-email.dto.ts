import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
  @IsEmail(
    {},
    { message: 'A valid email address must be provided for the "to" field.' },
  )
  @IsNotEmpty({ message: 'The "to" field cannot be empty.' })
  to!: string;

  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;
}
