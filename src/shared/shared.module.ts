import { SharedService } from './shared.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SharedProviders } from './shared.provider';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [SharedService, ...SharedProviders],
  exports: [SharedService],
})
export class SharedModule {}
