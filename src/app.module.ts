import { SharedModule } from './shared/shared.module';
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';
import { PriceModule } from './price/price.module';
import { ProductModule } from './product/product.module';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MorganModule } from 'nest-morgan';
import { AppController } from './app.controller';
import { AppProviders } from './app.provider';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { UserModule } from './user/user.module';
import { SharedService } from './shared/shared.service';
import { KycModule } from './kyc/kyc.module';
import { TransactionModule } from './transaction/transaction.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    SharedModule,
    ReviewModule,
    CartModule,
    PriceModule,
    ProductModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    MorganModule,
    CacheModule.register(),
    KycModule,
    TransactionModule,
    ScheduleModule.forRoot(),
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService, SharedService, ...AppProviders],
})
export class AppModule {}
