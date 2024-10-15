import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @Length(2, 50)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly profile?: string;
}
