import {
  IsCurrency,
  IsEmail,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateChargeDto } from './create-charge.dto';

export class CreatePaymentDto extends CreateChargeDto {
  @IsEmail()
  email: string;
}
