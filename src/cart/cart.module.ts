import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Module } from '@nestjs/common';
import { CartProvider } from './cart.provider';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CartController],
  providers: [CartService, ...CartProvider],
  exports: [CartService],
})
export class CartModule {}
