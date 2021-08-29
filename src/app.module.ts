import { SharedModule } from './shared/shared.module';
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';
import { PriceModule } from './price/price.module';
import { ProductModule } from './product/product.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MorganModule } from 'nest-morgan';
import { AppController } from './app.controller';
import { AppProviders } from './app.provider';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { UserModule } from './user/user.module';
import { SharedService } from './shared/shared.service';

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
  ],
  controllers: [AppController],
  providers: [AppService, SharedService, ...AppProviders],
})
export class AppModule {}
