import { SharedService } from './shared.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
