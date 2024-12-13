import { IsString } from 'class-validator';

export class FCMDto {
  @IsString()
  fcmToken?: string;
}
