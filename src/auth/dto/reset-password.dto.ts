import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
