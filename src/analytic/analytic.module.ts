import { Module } from '@nestjs/common';
import { AnalyticService } from './analytic.service';
import { AnalyticController } from './analytic.controller';

import { AnalyticProviders } from './analytic.provider';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  providers: [AnalyticService, TransactionService, ...AnalyticProviders],
  controllers: [AnalyticController],
  imports: [AuthModule, SharedModule],
})
export class AnalyticModule {}
