import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class GoogleRegisterDto {
  @Length(2, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  providerId: string;

  @IsOptional()
  @IsString()
  profile?: string;
}
