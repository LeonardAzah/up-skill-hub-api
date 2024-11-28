import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class SendNotificationDTO {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  token: string;
}
