import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from 'src/transaction/transaction.module';
import { CronProviders } from './cron.provider';
import { CronService } from './cron.service';

@Module({
  imports: [ConfigModule, TransactionModule],
  providers: [CronService, ...CronProviders],
})
export class CronModule {}
