import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CommonModule } from 'common/common.module';
import { DatabaseModule } from 'common';

@Module({
  imports: [CommonModule, DatabaseModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
