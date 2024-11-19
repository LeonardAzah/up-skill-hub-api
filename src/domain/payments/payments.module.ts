import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CommonModule } from 'common/common.module';
import { ConfigModule } from 'common';

@Module({
  imports: [CommonModule, ConfigModule],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
