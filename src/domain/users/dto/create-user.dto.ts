import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @Length(2, 50)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsStrongPassword()
  readonly password: string;

  @IsOptional()
  @IsUrl()
  readonly profile?: string;
}
