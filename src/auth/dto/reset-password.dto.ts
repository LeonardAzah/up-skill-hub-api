import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  otp: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
