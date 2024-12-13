import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;
}
