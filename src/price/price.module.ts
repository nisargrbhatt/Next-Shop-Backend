import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { Module } from '@nestjs/common';
import { PriceProvider } from './price.provider';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PriceController],
  providers: [PriceService, ...PriceProvider],
  exports: [PriceService],
})
export class PriceModule {}
