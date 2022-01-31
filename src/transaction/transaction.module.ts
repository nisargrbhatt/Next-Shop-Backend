import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { PriceService } from 'src/price/price.service';
import { ProductService } from 'src/product/product.service';
import { AddressService } from 'src/user/addresses/address.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { TransactionController } from './transaction.controller';
import { TransactionProviders } from './transaction.provider';
import { TransactionService } from './transaction.service';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [TransactionController, OrderController, PaymentController],
  providers: [
    OrderService,
    PaymentService,
    TransactionService,
    ProductService,
    PriceService,
    AddressService,
    ...TransactionProviders,
  ],
  exports: [TransactionService, OrderService, PaymentService],
})
export class TransactionModule {}
