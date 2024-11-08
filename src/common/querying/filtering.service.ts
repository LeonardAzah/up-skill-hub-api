import { Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

@Injectable()
export class FilteringService {
  constains(text: string) {
    if (!text) return;
    return ILike(`%${text}%`);
  }
}
